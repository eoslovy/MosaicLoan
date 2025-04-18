package com.mosaic.investment.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.contract.repository.ContractRepository;
import com.mosaic.contract.service.ContractService;
import com.mosaic.core.exception.InternalSystemException;
import com.mosaic.core.model.Contract;
import com.mosaic.core.model.ContractTransaction;
import com.mosaic.core.model.Investment;
import com.mosaic.core.model.Loan;
import com.mosaic.core.model.status.ContractStatus;
import com.mosaic.core.model.status.LoanStatus;
import com.mosaic.investment.dto.RequestInvestmentDto;
import com.mosaic.investment.event.producer.InvestmentKafkaProducer;
import com.mosaic.investment.exception.InvestmentNotFoundException;
import com.mosaic.investment.repository.InvestmentQueryRepository;
import com.mosaic.investment.repository.InvestmentRepository;
import com.mosaic.loan.event.message.LoanCreateTransactionPayload;
import com.mosaic.loan.exception.LoanNotFoundException;
import com.mosaic.loan.repository.LoanRepository;
import com.mosaic.loan.service.LoanTransactionServiceImpl;
import com.mosaic.payload.AccountTransactionPayload;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class InvestmentServiceImpl implements InvestmentService {
	//TODO 진입점 기준으로 서비스 쪼개기
	private final InvestmentRepository investmentRepository;
	private final InvestmentQueryRepository investmentQueryRepository;
	private final LoanRepository loanRepository;
	private final InvestmentKafkaProducer investmentProducer;
	private final ContractService contractService;
	private final InvestmentTransactionalService investmentTransactionalService;
	private final ContractRepository contractRepository;
	private final LoanTransactionServiceImpl loanTransactionServiceImpl;

	//입금
	@Override
	@Transactional
	public void publishInvestmentRequest(RequestInvestmentDto requestDto, LocalDateTime now, Integer memberId,
		Boolean isBot) throws
		InternalSystemException, JsonProcessingException {
		//TODO 멱등성 : 시간기준 UUID 및 요청별 request막는 ttl 발행
		Integer idempotencyKey = requestDto.hashCode();
		Investment newInvestment = Investment.requestOnlyFormInvestment(requestDto, memberId, now);
		Investment saved = investmentRepository.save(newInvestment);
		AccountTransactionPayload requestEvent = AccountTransactionPayload.buildInvest(saved, requestDto, now);
		investmentProducer.sendInvestmentDepositRequest(requestEvent);
	}

	@Override
	@Transactional
	public void completeInvestmentRequest(AccountTransactionPayload completeInvestmentRequest)
		throws InternalSystemException, JsonProcessingException {
		Optional<Investment> optionalInvestment = investmentRepository.findById(completeInvestmentRequest.targetId());
		if (optionalInvestment.isEmpty()) {
			investmentProducer.sendInvestmentDepositReject(completeInvestmentRequest);
			throw new InvestmentNotFoundException(completeInvestmentRequest.targetId());
		}
		Investment investment = optionalInvestment.get();
		investment.completeRequest(completeInvestmentRequest);
	}

	@Override
	@Transactional
	public void executeCompleteInvestmentByDueDate(LocalDateTime now, Boolean isBot) throws JsonProcessingException {
		List<Investment> investments = investmentRepository.findAllByDueDate(now.toLocalDate());
		Integer countSuccess = 0;
		for (Investment investment : investments) {
			//강제 유동화 실행후 결과
			Boolean isDone = finishActiveInvestment(investment, now, isBot);
			if (isDone) {
				BigDecimal withdrawnAmount = investment.withdrawAll();
				investment.finishInvestment();
				AccountTransactionPayload investWithdrawalPayload = AccountTransactionPayload.buildInvestWithdrawal(
					investment,
					withdrawnAmount, now);
				investmentProducer.sendInvestmentWithdrawalRequest(investWithdrawalPayload);
				log.info("투자의 상태가{}로 완료되어 {}의 계좌로 돈을 보냈습니다", investment.getStatus(), investment.getAccountId());
				countSuccess++;
			} else {
				log.info("투자의 상태가{}로 완료되지 못해 {}의 투자종료에 실패했습니다", investment.getStatus(), investment.getAccountId());
			}
		}
		log.info("[{}]개의 투자가 성공적으로 종료되었습니다", countSuccess);
	}

	//투자 종료 강제 유동화
	@Override
	public Boolean finishActiveInvestment(Investment investment, LocalDateTime now, Boolean isBot) {
		for (Contract contract : investment.getContracts()) {
			if (contract.getStatus().equals(ContractStatus.DELINQUENT)) {
				contractService.liquidateContract(contract, now);
			}
		}
		for (Contract contract : investment.getContracts()) {
			if (!Contract.isComeplete(contract)) {
				log.info("투자번호 {} 가 정상적으로 종료되지 못합니다", investment.getId());
				return false;
			}
		}
		log.info("투자번호 {}가 정상적으로 종료되었습니다", investment.getId());
		return true;
	}

	//출금

	@Override
	@Transactional
	public void rollbackInvestmentWithdrawal(AccountTransactionPayload payload) {
		Investment investment = investmentRepository.findById(payload.targetId())
			.orElseThrow(() -> new InvestmentNotFoundException(payload.targetId()));
		investment.rollBack(payload.amount());
		investment.unFinishInvestment();
	}

	@Override
	@Transactional
	public void searchLoanAptInvestor(LoanCreateTransactionPayload loanTransactionReq) throws JsonProcessingException {
		// 1. 대출 조회
		Loan loan = loanRepository.findByIdAndStatus(loanTransactionReq.loanId(), LoanStatus.PENDING)
			.orElseThrow(() -> new LoanNotFoundException(loanTransactionReq.loanId()));

		BigDecimal requestAmount = loan.getRequestAmount();
		BigDecimal alreadyRaised = loan.getAmount();
		BigDecimal requiredAmount = requestAmount.subtract(alreadyRaised);

		if (requiredAmount.compareTo(BigDecimal.ZERO) <= 0)
			return; // 이미 완료

		// 2. 최소 투자금 기준 계산 (예: 전체 금액의 10분의 1, 하드코딩 X)
		BigDecimal minimumPerInvestment = BigDecimal.valueOf(100);

		// 3. 조건에 맞는 투자자 조회
		List<Investment> candidates = investmentQueryRepository.findQualifiedInvestments(minimumPerInvestment,
			loanTransactionReq.expectYield(), loan);
		log.info("{}명의 투자자 발견", candidates.size());
		BigDecimal accumulated = BigDecimal.ZERO;
		List<Contract> contracts = new ArrayList<>();
		for (Investment investment : candidates) {
			if (accumulated.compareTo(requiredAmount) >= 0)
				break;

			BigDecimal baseAmount = investment.getPrincipal()
				.divide(new BigDecimal(200), 0, RoundingMode.DOWN); // 1/200
			BigDecimal truncated = baseAmount.divide(new BigDecimal(100), 0, RoundingMode.DOWN)
				.multiply(new BigDecimal(100)); // 100원 단위 절사

			if (truncated.compareTo(BigDecimal.ZERO) <= 0)
				continue;

			BigDecimal available = investment.getAmount();
			BigDecimal remaining = requiredAmount.subtract(accumulated);
			BigDecimal allocated = truncated.min(available).min(remaining);

			if (allocated.compareTo(BigDecimal.ZERO) <= 0)
				continue;

			Contract contract = Contract.create(
				loan,
				investment,
				allocated,
				loanTransactionReq.expectYield(),
				loanTransactionReq.interestRate(),
				250
			);

			contracts.add(contract);
			accumulated = accumulated.add(allocated);
			investment.addExpectYield(contract);
			investment.investAmount(contract);
		}

		if (accumulated.compareTo(requiredAmount) < 0) {
			log.info("투자금액 부족: {}원을 모집하려 했으나, {}을 모집하였습니다,", requiredAmount, accumulated);
			throw new IllegalStateException("조건에 맞는 투자금 부족으로 매칭 실패");
		}

		for (Contract c : contracts) {
			c.putTransaction(ContractTransaction.buildLoanCreateTransaction(c, c.getAmount(), c.getCreatedAt()));
		}
		loan.addContracts(contracts);

		loan.startLoan(accumulated);

		contractRepository.saveAll(contracts); // 하위 엔티티까지 전부 저장
		loanTransactionServiceImpl.publishLoanWithdrawalRequest(loan, loan.getCreatedAt(), Boolean.TRUE);
		log.info("{} 대출 진행에 성공했습니다", loan.getId());
	}
}

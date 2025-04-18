package com.mosaic.loan.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.contract.service.ContractService;
import com.mosaic.core.model.Contract;
import com.mosaic.core.model.Loan;
import com.mosaic.core.model.status.ContractStatus;
import com.mosaic.core.model.status.LoanStatus;
import com.mosaic.core.util.InternalApiClient;
import com.mosaic.loan.dto.CreateLoanRequestDto;
import com.mosaic.loan.dto.CreditEvaluationResponseDto;
import com.mosaic.loan.dto.EvaluationStatus;
import com.mosaic.loan.event.message.LoanCreateTransactionPayload;
import com.mosaic.loan.event.producer.LoanKafkaProducer;
import com.mosaic.loan.exception.LoanNotFoundException;
import com.mosaic.loan.repository.LoanRepository;
import com.mosaic.payload.AccountTransactionPayload;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class LoanServiceImpl implements LoanService {

	private final LoanKafkaProducer loanKafkaProducer;
	private final LoanRepository loanRepository;
	private final InternalApiClient internalApiClient;
	private final LoanTransactionServiceImpl loanTransactionService;
	private final ContractService contractService;
	private final EntityManager em;

	//투자 생성
	@Override
	@Transactional
	public void createLoan(CreateLoanRequestDto request, Integer memberId, LocalDateTime now, Boolean isBot) throws
		JsonProcessingException {
		//Todo 내부 신용평가 확인후 예외처리(없음, 시간지남 등등)
		Random random = new Random();
		//CreditEvaluationResponseDto creditEvaluationResponseDto = internalApiClient.getMemberCreditEvaluation(memberId);
		CreditEvaluationResponseDto creditEvaluationResponseDto = CreditEvaluationResponseDto.builder()
			.id(memberId)
			.maxLoanLimit(memberId)
			.caseId(memberId)
			.interestRate(random.nextInt(800, 1700))
			.defaultRate(random.nextInt(400, 800))
			.expectYield(random.nextInt(300, 800))
			.status(EvaluationStatus.APPROVED)
			.build();
		if (!evaluateLoanRequest(creditEvaluationResponseDto))
			return;
		// 시간 어떻게 쓸지 확정 필요
		log.info("[{}] 유저 {} 시에 대출이 시작되었습니다", now, memberId);
		Loan newLoan = Loan.requestOnlyFormLoan(request, creditEvaluationResponseDto, memberId, now);
		log.info(newLoan.toString());
		loanRepository.save(newLoan);
		LoanCreateTransactionPayload payload = LoanCreateTransactionPayload.buildLoan(newLoan,
			creditEvaluationResponseDto);
		//log.info("Create loan: {}", payload);
		loanKafkaProducer.sendLoanCreatedRequest(payload);
	}

	@Override
	@Transactional
	public void manageInterestOfDelinquentLoans(LocalDateTime now, Boolean isBot) {
		List<Loan> loans = loanRepository.findByStatus(LoanStatus.DELINQUENT);
		for (Loan loan : loans) {
			contractService.addDelinquentMarginInterest(loan);
		}
		log.info("{}개의 대출에 에 가산이자 적용 완료되었습니다", loans.size());
	}

	@Override
	@Transactional
	public void liquidateScheduledDelinquentLoans(LocalDateTime now, Boolean isBot) throws Exception {
		List<Loan> loans = loanRepository.findAllByDueDateAndStatus(now.toLocalDate().minusMonths(3),
			LoanStatus.DELINQUENT);
		for (Loan loan : loans) {
			liquidateDelinquentLoan(loan, now);
		}
		log.info("{}개의 대출을 유동화햇습니다", loans.size());
	}

	public void liquidateDelinquentLoan(Loan loan, LocalDateTime now) throws Exception {
		if (loan.getId() == null) {
			return;
		}
		for (Contract contract : loan.getContracts()) {
			loan.liquidate();
			Contract liquidatedContract = contractService.liquidateContract(contract, now);
			if (!contract.getStatus().equals(ContractStatus.OWNERSHIP_TRANSFERRED))
				throw new Exception("liquidateFail");
		}
	}

	//상환입금
	@Override
	public void publishAndCalculateLoanRepayRequest(Loan loan,
		Boolean isBot, LocalDateTime now) throws JsonProcessingException {
		BigDecimal moneyToRepay = BigDecimal.ZERO;
		for (Contract contract : loan.getContracts()) {
			moneyToRepay = moneyToRepay.add(contract.getOutstandingAmount());
			BigDecimal interestOfContract = loanTransactionService.calculateInterestAmount(contract,
				contract.getOutstandingAmount(),
				now.toLocalDate());
			//contract.addInterestAmountToOutstandingAmount(interestOfContract);
			moneyToRepay = moneyToRepay.add(interestOfContract);
		}
		loanKafkaProducer.sendLoanRepayRequestEvent(AccountTransactionPayload.buildLoanRepay(loan, moneyToRepay, now));
	}

	@Override
	@Transactional
	public void completeLoanDepositRequest(AccountTransactionPayload accountTransactionComplete) throws
		JsonProcessingException {
		Loan loan = loanRepository.findById(accountTransactionComplete.targetId())
			.orElse(null);
		if (loan == null) {
			loanKafkaProducer.sendLoanDepositFailEvent(accountTransactionComplete);
			throw new LoanNotFoundException(accountTransactionComplete.targetId());
		}
		loan.addAmount(accountTransactionComplete);
	}

	//상환 필요금과 실 상환금 비율 맞춰 분배
	//대출금 출

	@Override
	@Transactional
	public void findRepaymentDueLoansAndRequestRepayment(LocalDateTime now, Boolean isBot) throws
		JsonProcessingException {
		log.info("시간 [{}]의 대상 대출 상환 준비를 시작합니다", now);
		List<Loan> loans = loanRepository.findAllByDueDateAndStatus(now.toLocalDate(), LoanStatus.IN_PROGRESS);
		log.info("{}개의 대출 계약 상환에 필요한 자금요청이 시작됩니다", loans.size());
		for (Loan loan : loans) {
			publishAndCalculateLoanRepayRequest(loan, isBot, now);
		}
		log.info("{}대출 계약의 상환 처리가 완료되었습니다", loans.size());
	}

	@Override
	public void executeDueLoanRepayments(LocalDateTime now, Boolean isBot) throws Exception {
		log.info("시간 [{}]의 대상 대출 상환 실행을 시작합니다", now);
		List<Loan> loans = loanRepository.findAllByDueDateAndStatus(now.toLocalDate(), LoanStatus.IN_PROGRESS);
		log.info("{}개의 대출 계약 상환에 필요한 자금요청이 시작됩니다", loans.size());
		for (Loan loan : loans) {
			loanTransactionService.executeLoanRepay(loan, now, isBot);
			//log.error("Loan {} 처리 실패: {}", loan.getId());
		}
		log.info("{}개의 대출 계약 상환의 자금처리가 완료되었습니다", loans.size());
	}

	// @Override
	// public void executeLoanRepaymentsById(Integer loanId, LocalDateTime now, Boolean isBot) throws Exception {
	// 	log.info("대상계약 [{}]에 대한 대상 대출 상환을 실행합니다,", now);
	//
	// 	loanTransactionService.executeLoanRepay(loanId, now, isBot);
	// }

	private Boolean evaluateLoanRequest(CreditEvaluationResponseDto creditEvaluationResponseDto) {
		if (creditEvaluationResponseDto.getStatus().equals(EvaluationStatus.APPROVED))
			return Boolean.TRUE;
		return Boolean.FALSE;
	}
}

package com.mosaic.loan.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.Year;
import java.time.temporal.ChronoUnit;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.core.model.Contract;
import com.mosaic.core.model.ContractTransaction;
import com.mosaic.core.model.Loan;
import com.mosaic.core.model.status.LoanStatus;
import com.mosaic.core.util.InternalApiClient;
import com.mosaic.core.util.TimeUtil;
import com.mosaic.investment.dto.WithdrawalInvestmentDto;
import com.mosaic.loan.dto.CreateLoanRequestDto;
import com.mosaic.loan.dto.CreditEvaluationResponseDto;
import com.mosaic.loan.dto.EvaluationStatus;
import com.mosaic.loan.dto.RepayLoanDto;
import com.mosaic.loan.event.message.LoanCreateTransactionPayload;
import com.mosaic.loan.event.producer.LoanKafkaProducer;
import com.mosaic.loan.exception.LoanNotFoundException;
import com.mosaic.loan.repository.LoanRepository;
import com.mosaic.payload.AccountTransactionPayload;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class LoanServiceImpl implements LoanService {

	private final LoanKafkaProducer loanKafkaProducer;
	private final LoanRepository loanRepository;
	private final InternalApiClient internalApiClient;
	private final TimeUtil timeUtil;

	//투자 생성
	@Override
	@Transactional
	public void createLoan(CreateLoanRequestDto request, Boolean isBot) throws JsonProcessingException {
		//Todo 내부 신용평가 확인후 예외처리(없음, 시간지남 등등)
		//CreditEvaluationResponseDto creditEvaluationResponseDto = internalApiClient.getMemberCreditEvaluation(request);
		//예시용
		CreditEvaluationResponseDto creditEvaluationResponseDto = CreditEvaluationResponseDto.builder()
			.id(request.id())
			.interestRate(800)
			.defaultRate(80)
			.build();
		//if (!evaluateLoanRequest(creditEvaluationResponseDto)) return;
		// 시간 어떻게 쓸지 확정 필요
		LocalDateTime now = timeUtil.now(isBot);
		Loan newLoan = Loan.requestOnlyFormLoan(request, creditEvaluationResponseDto, now);
		loanRepository.save(newLoan);
		LoanCreateTransactionPayload payload = LoanCreateTransactionPayload.buildLoan(newLoan,
			creditEvaluationResponseDto);
		log.info("Create loan: {}", payload);
		loanKafkaProducer.sendLoanCreatedRequest(payload);
	}

	//상환입금
	@Override
	@Transactional
	public void publishAndCalculateLoanRepayRequest(RepayLoanDto requestDto,
		Boolean isBot) throws JsonProcessingException {
		Loan loan = loanRepository.findByIdAndStatus(requestDto.id(), LoanStatus.IN_PROGRESS)
			.orElseThrow(() -> new LoanNotFoundException(requestDto.id()));
		BigDecimal moneyToRepay = BigDecimal.ZERO;
		for (Contract contract : loan.getContracts()) {
			moneyToRepay = moneyToRepay.add(contract.getOutstandingAmount());
			BigDecimal interestOfContract = calculateInterestAmount(contract, contract.getOutstandingAmount());
			//contract.addInterestAmountToOutstandingAmount(interestOfContract);
			moneyToRepay = moneyToRepay.add(interestOfContract);
		}
		LocalDateTime now = timeUtil.now(isBot);
		loanKafkaProducer.sendLoanRepayRequestEvent(AccountTransactionPayload.buildLoanRepay(loan, moneyToRepay, now));
	}

	private BigDecimal calculateInterestAmount(Contract contract, BigDecimal amount) {
		long days = ChronoUnit.DAYS.between(contract.getDueDate(), contract.getCreatedAt().toLocalDate());
		BigDecimal dailyRate = BigDecimal.valueOf(contract.getInterestRate())
			.divide(BigDecimal.valueOf(365 + (Year.isLeap(contract.getCreatedAt().getYear()) ? 1 : 0)), 18,
				RoundingMode.DOWN);
		BigDecimal dailyInterest = amount
			.multiply(dailyRate)
			.divide(BigDecimal.valueOf(10000), 18, RoundingMode.DOWN);
		return dailyInterest
			.multiply(BigDecimal.valueOf(days))
			.setScale(5, RoundingMode.DOWN);
	}

	//상환 필요금과 실 상환금 비율 맞춰 분배
	@Override
	@Transactional
	public void completeLoanRepayRequest(AccountTransactionPayload payload) throws Exception {
		Loan loan = loanRepository.findByIdAndStatus(payload.targetId(), LoanStatus.IN_PROGRESS)
			.orElseThrow(() -> new LoanNotFoundException(payload.targetId()));
		BigDecimal repaidAmountResidue = payload.amount();
		BigDecimal originalMoneyToRepay = BigDecimal.ZERO;
		BigDecimal interestToRepay = BigDecimal.ZERO;
		for (Contract contract : loan.getContracts()) {
			originalMoneyToRepay = originalMoneyToRepay.add(contract.getOutstandingAmount());
			BigDecimal interestOfContract = calculateInterestAmount(contract, contract.getOutstandingAmount());
			interestToRepay = interestToRepay.add(interestOfContract);
		}
		//총 상환 비율
		BigDecimal returnInterestRatio = repaidAmountResidue.divide(interestToRepay, 18, RoundingMode.DOWN)
			.min(BigDecimal.ONE);
		if (BigDecimal.ZERO.compareTo(returnInterestRatio) >= 0) {
			return; //상환비율 0 처리불가능
		}

		for (Contract contract : loan.getContracts()) {
			BigDecimal calculatedTotalInterest = calculateInterestAmount(contract, contract.getOutstandingAmount());
			ContractTransaction interestTransaction = ContractTransaction.buildRepayInterestTransaction(contract,
				// 여기도 시간 Bot 처리 어려워서 일단 payload꺼 그대로 넣음
				calculatedTotalInterest.multiply(returnInterestRatio), payload.createdAt());
			contract.updateOutstandingAmountAfterInterestRepaid(calculatedTotalInterest,
				interestTransaction.getAmount());
			contract.putTransaction(interestTransaction);

			repaidAmountResidue = repaidAmountResidue.subtract(interestTransaction.getAmount());
		}

		BigDecimal returnPrincipalRatio = repaidAmountResidue.divide(originalMoneyToRepay, 18, RoundingMode.DOWN)
			.min(BigDecimal.ONE);
		if (BigDecimal.ZERO.compareTo(returnPrincipalRatio) >= 0) {
			return; //상환비율 0 처리불가능
		}
		for (Contract contract : loan.getContracts()) {
			BigDecimal calculatedTotalPrincipal = contract.getOutstandingAmount();
			ContractTransaction principalTransaction = ContractTransaction.buildRepayPrincipalTransaction(contract,
				calculatedTotalPrincipal.multiply(returnPrincipalRatio), payload.createdAt());
			contract.updateOutstandingAmountAfterPrincipalRepaid(principalTransaction);
			contract.putTransaction(principalTransaction);

			repaidAmountResidue = repaidAmountResidue.subtract(principalTransaction.getAmount());
		}

		if (repaidAmountResidue.compareTo(BigDecimal.ZERO) < 0) {
			throw new IllegalStateException("받은 돈보다 더 많이 분배했습니다.");
		}
		if (repaidAmountResidue.compareTo(BigDecimal.ZERO) > 0) {
			loan.delinquentLoan();
			log.info("{}의 대출금액 상환 미달로 부분상환 후 상태 {}로 변경", loan.getId(), loan.getStatus());
		}
		//TODO 현재투자 수익률 재조정식
		//이자상환
		//Transaction만들기

		//원금상환
		//Transaction만들기

	}

	//대출금 출금
	@Override
	@Transactional
	public void publishLoanWithdrawalRequest(WithdrawalInvestmentDto requestDto, Boolean isBot) throws
		JsonProcessingException {
		Loan loan = loanRepository.findById(requestDto.id())
			.orElseThrow(() -> new LoanNotFoundException(requestDto.id()));
		BigDecimal withdrawnAmount = loan.withdrawAll();
		LocalDateTime now = timeUtil.now(isBot);
		AccountTransactionPayload withdrawalEventPayload = AccountTransactionPayload.buildLoanWithdrawal(loan,
			withdrawnAmount, now);
		loanKafkaProducer.sendLoanWithdrawalRequest(withdrawalEventPayload);
	}

	@Override
	@Transactional
	public void rollbackLoanWithdrawal(AccountTransactionPayload payload) {
		Loan loan = loanRepository.findById(payload.targetId())
			.orElseThrow(() -> new LoanNotFoundException(payload.targetId()));
		loan.rollBack(payload.amount());
	}

	@Override
	@Transactional
	public void failLoanRepayRequest(AccountTransactionPayload payload) {
		Loan loan = loanRepository.findByIdAndStatus(payload.targetId(), LoanStatus.IN_PROGRESS)
			.orElseThrow(() -> new LoanNotFoundException(payload.targetId()));
		log.info("{}의 대출이 연체상태로 변경되었습니다 연체금 : {}", payload.targetId(), loan.getAmount());
		loan.delinquentLoan();
	}

	private Boolean evaluateLoanRequest(CreditEvaluationResponseDto creditEvaluationResponseDto) {
		if (creditEvaluationResponseDto.getStatus().equals(EvaluationStatus.APPROVED))
			return Boolean.TRUE;
		return Boolean.FALSE;
	}

	public void completeLoan() {
		//Todo loanConumser에서 완료 수신 후 loan증가
	}
}

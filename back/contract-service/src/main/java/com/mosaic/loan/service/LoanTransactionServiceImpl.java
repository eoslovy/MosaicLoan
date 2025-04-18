package com.mosaic.loan.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.core.model.Contract;
import com.mosaic.core.model.ContractTransaction;
import com.mosaic.core.model.Loan;
import com.mosaic.core.model.status.LoanStatus;
import com.mosaic.loan.event.producer.LoanKafkaProducer;
import com.mosaic.loan.exception.LoanNotFoundException;
import com.mosaic.loan.repository.LoanRepository;
import com.mosaic.payload.AccountTransactionPayload;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.time.temporal.ChronoUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class LoanTransactionServiceImpl implements LoanTransactionService {
	private final LoanRepository loanRepository;
	private final LoanKafkaProducer loanKafkaProducer;

	@Transactional
	@Override
	public void publishLoanWithdrawalRequest(Loan loan, LocalDateTime now,
		//WithdrawalInvestmentDto requestDto, LocalDateTime now,
		Boolean isBot) throws
		JsonProcessingException {
		//Loan loan = loanRepository.findById(requestDto.id()).orElseThrow(() -> new LoanNotFoundException(requestDto.id()));
		BigDecimal withdrawnAmount = loan.withdrawAll();
		AccountTransactionPayload withdrawalEventPayload = AccountTransactionPayload.buildLoanWithdrawal(loan,
			withdrawnAmount, now);
		loanKafkaProducer.sendLoanWithdrawalRequest(withdrawalEventPayload);
	}

	@Transactional
	@Override
	public void rollbackLoanWithdrawal(AccountTransactionPayload payload) {
		Loan loan = loanRepository.findById(payload.targetId())
			.orElseThrow(() -> new LoanNotFoundException(payload.targetId()));
		loan.rollBack(payload.amount());
	}

	@Transactional
	@Override
	public void failLoanRepayRequest(AccountTransactionPayload payload) {
		Loan loan = loanRepository.findByIdAndStatus(payload.targetId(), LoanStatus.IN_PROGRESS)
			.orElseThrow(() -> new LoanNotFoundException(payload.targetId()));
		log.info("{}의 대출이 연체상태로 변경되었습니다 연체금 : {}", payload.targetId(), loan.getAmount());
		loan.setStatusDelinquent();
	}

	@Override
	@Transactional
	public void executeLoanRepay(Loan loan, LocalDateTime now, Boolean isBot) throws Exception {
		BigDecimal repaidAmountResidue = loan.getAmount();
		BigDecimal originalMoneyToRepay = BigDecimal.ZERO;
		BigDecimal interestToRepay = BigDecimal.ZERO;
		for (Contract contract : loan.getContracts()) {
			originalMoneyToRepay = originalMoneyToRepay.add(contract.getOutstandingAmount());
			BigDecimal interestOfContract = calculateInterestAmount(contract, contract.getOutstandingAmount(),
				now.toLocalDate());
			interestToRepay = interestToRepay.add(interestOfContract);
		}
		//총 상환 비율
		BigDecimal returnInterestRatio = repaidAmountResidue.divide(interestToRepay, 5, RoundingMode.DOWN)
			.min(BigDecimal.ONE);
		if (BigDecimal.ZERO.compareTo(returnInterestRatio) >= 0) {
			//for (Contract contract : loan.getContracts()) {
			//	contract.setStatusDelinquent();
			//}
			loan.setStatusDelinquent();
			//return;
			//throw new Exception("이자를 상환할 금액이 부족합니다.");
		}

		for (Contract contract : loan.getContracts()) {
			BigDecimal calculatedTotalInterest = calculateInterestAmount(contract, contract.getOutstandingAmount(), now
				.toLocalDate());
			ContractTransaction interestTransaction = ContractTransaction.buildRepayInterestTransaction(contract,
				// 여기도 시간 Bot 처리 어려워서 일단 payload꺼 그대로 넣음
				calculatedTotalInterest.multiply(returnInterestRatio), now);
			contract.updateOutstandingAmountAfterInterestRepaid(calculatedTotalInterest,
				interestTransaction.getAmount());
			contract.putTransaction(interestTransaction);

			contract.getInvestment().addCurrentRate(interestTransaction, contract);

			repaidAmountResidue = repaidAmountResidue.subtract(interestTransaction.getAmount());
		}

		BigDecimal returnPrincipalRatio = repaidAmountResidue.divide(originalMoneyToRepay, 5, RoundingMode.DOWN)
			.min(BigDecimal.ONE);
		if (BigDecimal.ZERO.compareTo(returnPrincipalRatio) >= 0) {
			loan.setStatusDelinquent();
			for (Contract contract : loan.getContracts()) {
				contract.setStatusDelinquent();
			}
			// 이자는 이미 상환했기 때문에 롤백되면 안됨
			loan.repay(repaidAmountResidue);
			return;
		}
		for (Contract contract : loan.getContracts()) {
			BigDecimal calculatedTotalPrincipal = contract.getOutstandingAmount();
			ContractTransaction principalTransaction = ContractTransaction.buildRepayPrincipalTransaction(contract,
				calculatedTotalPrincipal.multiply(returnPrincipalRatio), now);
			contract.updateOutstandingAmountAfterPrincipalRepaid(principalTransaction);
			contract.putTransaction(principalTransaction);

			repaidAmountResidue = repaidAmountResidue.subtract(principalTransaction.getAmount());
		}

		BigDecimal tolerance = new BigDecimal("0.1");
		if (repaidAmountResidue.compareTo(new BigDecimal("-0.1")) < 0) {
			throw new IllegalStateException("받은 돈보다 더 많이 분배했습니다.");
		}

		if (repaidAmountResidue.compareTo(tolerance) > 0) {
			loan.setStatusDelinquent();
			for (Contract contract : loan.getContracts()) {
				contract.setStatusDelinquent();
			}
			log.info("{}의 대출금액 상환 미달로 부분상환 후 상태 {}로 변경", loan.getId(), loan.getStatus());
			loan.repay(repaidAmountResidue);
			return;
		}

		loan.setStatusComplete();
		for (Contract contract : loan.getContracts()) {
			contract.setStatusComplete();
			contract.getInvestment().subtractExpectYield(contract);
		}
		loan.repay(repaidAmountResidue);
		log.info("{}의 대출완납으로 상태 완료로 변경", loan.getId());
	}

	public BigDecimal calculateInterestAmount(Contract contract, BigDecimal amount, LocalDate now) {

		long days = ChronoUnit.DAYS.between(contract.getCreatedAt().toLocalDate(), now);

		BigDecimal dailyRate = BigDecimal.valueOf(contract.getInterestRate())
			.divide(BigDecimal.valueOf(365 + (Year.isLeap(contract.getCreatedAt().getYear()) ? 1 : 0)), 5,
				RoundingMode.DOWN);
		BigDecimal dailyInterest = amount
			.multiply(dailyRate)
			.divide(BigDecimal.valueOf(10000), 5, RoundingMode.DOWN);
		return dailyInterest
			.multiply(BigDecimal.valueOf(days))
			.setScale(5, RoundingMode.DOWN);
	}
}

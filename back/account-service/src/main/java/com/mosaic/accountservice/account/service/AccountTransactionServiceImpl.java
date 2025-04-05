package com.mosaic.accountservice.account.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.accountservice.account.domain.Account;
import com.mosaic.accountservice.account.domain.AccountTransaction;
import com.mosaic.accountservice.account.domain.TransactionType;
import com.mosaic.accountservice.account.outbox.OutboxEventService;
import com.mosaic.accountservice.account.repository.AccountRepository;
import com.mosaic.accountservice.account.repository.AccountTransactionRepository;
import com.mosaic.payload.AccountTransactionPayload;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountTransactionServiceImpl implements AccountTransactionService {
	private final AccountRepository accountRepository;
	private final AccountTransactionRepository transactionRepository;
	private final OutboxEventService outboxEventService;

	@Override
	@Transactional
	public void handleExternalDeposit(AccountTransactionPayload payload) throws JsonProcessingException {
		try {
			var tx = processTransaction(payload.accountId(), payload.amount(), TransactionType.EXTERNAL_IN, "외부 입금",
				payload.targetId(), null);
			// outboxEventService.createOutboxEvent("external.deposit.completed , AccountTransactionPayload.forCompleted(payload, tx.getId()));
		} catch (Exception exception) {
			// outboxEventService.createOutboxEvent("external.deposit.failed", payload);
			log.error("외부 입금 트랜잭션 처리 중 오류가 발생했습니다. message: {}", exception.getMessage(), exception);
			throw exception;
		}
	}

	@Override
	@Transactional
	public void handleExternalWithdrawal(AccountTransactionPayload payload) throws JsonProcessingException {
		try {
			var tx = processTransaction(payload.accountId(), payload.amount(), TransactionType.EXTERNAL_OUT, "외부 출금",
				payload.targetId(), null);
			// outboxEventService.createOutboxEvent("external.deposit.completed , AccountTransactionPayload.forCompleted(payload, tx.getId()));
		} catch (Exception exception) {
			// outboxEventService.createOutboxEvent("external.deposit.failed", payload);
			log.error("외부 입금 트랜잭션 처리 중 오류가 발생했습니다. message: {}", exception.getMessage(), exception);
			throw exception;
		}
	}

	@Override
	@Transactional
	public void handleInvestmentDeposit(AccountTransactionPayload payload) throws JsonProcessingException {
		try {
			var tx = processTransaction(payload.accountId(), payload.amount(), TransactionType.INVESTMENT_OUT,
				"투자 계좌 입금",
				payload.targetId(), null);
			outboxEventService.createOutboxEvent("investment.deposit.completed",
				AccountTransactionPayload.forCompleted(payload, tx.getId()));
		} catch (Exception exception) {
			outboxEventService.createOutboxEvent("investment.deposit.rejected", payload);
			log.error("투자 계좌 입금 트랜잭션 처리 중 오류가 발생했습니다. message: {}", exception.getMessage(), exception);
			throw exception;
		}
	}

	@Override
	@Transactional
	public void handleInvestmentWithdrawal(AccountTransactionPayload payload) throws JsonProcessingException {
		try {
			var tx = processTransaction(payload.accountId(), payload.amount(), TransactionType.INVESTMENT_IN,
				"투자 계좌 출금",
				payload.targetId(), null);
			outboxEventService.createOutboxEvent("investment.deposit.completed",
				AccountTransactionPayload.forCompleted(payload, tx.getId()));
		} catch (Exception exception) {
			outboxEventService.createOutboxEvent("investment.deposit.rejected", payload);
			log.error("투자 계좌 출금 트랜잭션 처리 중 오류가 발생했습니다. message: {}", exception.getMessage(), exception);
			throw exception;
		}
	}

	@Override
	@Transactional
	public void handleLoanDeposit(AccountTransactionPayload payload) throws JsonProcessingException {
		try {
			var tx = processTransaction(payload.accountId(), payload.amount(), TransactionType.LOAN_OUT, "대출 계좌 입금(상환)",
				payload.targetId(), null);
			outboxEventService.createOutboxEvent("loan.deposit.completed",
				AccountTransactionPayload.forCompleted(payload, tx.getId()));
		} catch (Exception exception) {
			outboxEventService.createOutboxEvent("loan.deposit.rejected", payload);
			log.error("대출 계좌 입금 트랜잭션 처리 중 오류가 발생했습니다. message: {}", exception.getMessage(), exception);
			throw exception;
		}
	}

	@Override
	@Transactional
	public void handleLoanWithdrawal(AccountTransactionPayload payload) throws JsonProcessingException {
		try {
			var tx = processTransaction(payload.accountId(), payload.amount(), TransactionType.LOAN_IN, "대출 계좌 출금",
				payload.targetId(), null);
			outboxEventService.createOutboxEvent("loan.withdrawal.completed",
				AccountTransactionPayload.forCompleted(payload, tx.getId()));
		} catch (Exception exception) {
			outboxEventService.createOutboxEvent("loan.withdrawal.rejected", payload);
			log.error("대출 계좌 출금 트랜잭션 처리 중 오류가 발생했습니다. message: {}", exception.getMessage(), exception);
			throw exception;
		}
	}

	@Override
	public void compensateInvestmentDepositFailure(AccountTransactionPayload payload) {
		processTransaction(payload.accountId(), payload.amount(), TransactionType.INVESTMENT_OUT_COMPENSATION,
			"투자 계좌 입금 보상", payload.targetId(), payload.compensationTargetId());
	}

	@Override
	public void compensateInvestmentWithdrawalFailure(AccountTransactionPayload payload) {
		processTransaction(payload.accountId(), payload.amount(), TransactionType.INVESTMENT_IN_COMPENSATION,
			"투자 계좌 출금 보상", payload.targetId(), payload.compensationTargetId());
	}

	@Override
	public void compensateLoanDepositFailure(AccountTransactionPayload payload) {
		processTransaction(payload.accountId(), payload.amount(), TransactionType.LOAN_OUT_COMPENSATION,
			"대출 계좌 입금(상환) 보상", payload.targetId(), payload.compensationTargetId());
	}

	@Override
	public void compensateLoanWithdrawalFailure(AccountTransactionPayload payload) {
		processTransaction(payload.accountId(), payload.amount(), TransactionType.LOAN_IN_COMPENSATION, "대출 계좌 출금 보상",
			payload.targetId(), payload.compensationTargetId());
	}

	private AccountTransaction processTransaction(Integer accountId, BigDecimal amount, TransactionType type,
		String content, Integer targetId, Integer compensationTargetId) {

		Account account = accountRepository.findById(accountId)
			.orElseThrow(() -> new IllegalArgumentException("Account not found"));

		BigDecimal currentCash = account.getCash();

		BigDecimal updatedCash = calculateUpdatedCash(currentCash, amount, type.isIncome());

		log.info(
			"[ProcessTransaction] accountId: {}, type: {}, amount: {}, currentCash: {}, updatedCash: {}, isCompensation: {}",
			accountId, type, amount, currentCash, updatedCash, type.isCompensation());
		account.updateCash(updatedCash);
		accountRepository.save(account);

		AccountTransaction tx = AccountTransaction.record(accountId, type, targetId, amount, content, updatedCash,
			compensationTargetId);
		return transactionRepository.save(tx);
	}

	private BigDecimal calculateUpdatedCash(BigDecimal currentCash, BigDecimal amount, boolean isIncome) {
		if (isIncome)
			return currentCash.add(amount);
		if (currentCash.compareTo(amount) < 0)
			throw new IllegalStateException("잔액 부족");
		return currentCash.subtract(amount);
	}
}

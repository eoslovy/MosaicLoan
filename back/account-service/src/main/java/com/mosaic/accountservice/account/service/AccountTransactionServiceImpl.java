package com.mosaic.accountservice.account.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.accountservice.account.domain.Account;
import com.mosaic.accountservice.account.domain.AccountTransaction;
import com.mosaic.accountservice.account.domain.TransactionType;
import com.mosaic.accountservice.account.event.payload.AccountTransactionPayload;
import com.mosaic.accountservice.account.outbox.OutboxEventService;
import com.mosaic.accountservice.account.repository.AccountRepository;
import com.mosaic.accountservice.account.repository.AccountTransactionRepository;

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
			processTransaction(payload.accountId(), payload.amount(), TransactionType.EXTERNAL_IN, "외부 입금",
				payload.targetId());
			// outboxEventService.createOutboxEvent("external.deposit.completed", payload);
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
			processTransaction(payload.accountId(), payload.amount(), TransactionType.EXTERNAL_OUT, "외부 출금",
				payload.targetId());
			// outboxEventService.createOutboxEvent("external.deposit.completed", payload);
		} catch (Exception exception) {
			// outboxEventService.createOutboxEvent("external.deposit.failed", payload);
			log.error("외부 입금 트랜잭션 처리 중 오류가 발생했습니다. message: {}", exception.getMessage(), exception);
			throw exception;
		}
	}

	private void processTransaction(Integer accountId, BigDecimal amount, TransactionType type,
		String content, Integer targetId) {
		Account account = accountRepository.findById(accountId)
			.orElseThrow(() -> new IllegalArgumentException("Account not found"));

		BigDecimal currentCash = account.getCash();
		BigDecimal updatedCash;

		if (type == TransactionType.INVESTMENT_OUT || type == TransactionType.LOAN_OUT
			|| type == TransactionType.EXTERNAL_OUT) {
			if (currentCash.compareTo(amount) < 0) {
				throw new IllegalStateException("잔액 부족");
			}
			updatedCash = currentCash.subtract(amount);
		} else {
			updatedCash = currentCash.add(amount);
		}

		account.updateCash(updatedCash);
		accountRepository.save(account);

		AccountTransaction tx = AccountTransaction.record(accountId, type, targetId, amount, content, updatedCash);
		transactionRepository.save(tx);
	}
}

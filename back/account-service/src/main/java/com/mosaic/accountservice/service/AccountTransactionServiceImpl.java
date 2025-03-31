package com.mosaic.accountservice.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import com.mosaic.accountservice.domain.Account;
import com.mosaic.accountservice.domain.AccountTransaction;
import com.mosaic.accountservice.domain.TransactionType;
import com.mosaic.accountservice.repository.AccountRepository;
import com.mosaic.accountservice.repository.AccountTransactionRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountTransactionServiceImpl implements AccountTransactionService {
	private final AccountRepository accountRepository;
	private final AccountTransactionRepository transactionRepository;

	@Transactional
	@Override
	public void processTransaction(Integer accountId, BigDecimal amount, TransactionType type,
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

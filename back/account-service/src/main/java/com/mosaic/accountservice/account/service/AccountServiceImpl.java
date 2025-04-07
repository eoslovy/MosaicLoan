package com.mosaic.accountservice.account.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import com.mosaic.accountservice.account.domain.Account;
import com.mosaic.accountservice.account.repository.AccountRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountServiceImpl implements AccountService {
	private final AccountRepository accountRepository;

	@Override
	public void createAccount(Integer memberId) {
		if (accountRepository.existsById(memberId)) {
			log.warn("Account creation failed: account for memberId {} already exists", memberId);
			throw new IllegalArgumentException("이미 계좌가 존재합니다. memberId=" + memberId);
		}
		accountRepository.save(Account.create(memberId));
	}

	@Override
	public BigDecimal getCurrentCash(Integer memberId) {
		return accountRepository.findById(memberId)
			.map(account -> {
				log.debug("조회된 계좌: memberId={}, amount={}", memberId, account.getCash());
				return account.getCash();
			})
			.orElseThrow(() -> new IllegalArgumentException("계좌가 존재하지 않습니다. memberId= " + memberId));
	}
}

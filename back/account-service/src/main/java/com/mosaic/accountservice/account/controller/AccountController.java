package com.mosaic.accountservice.account.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.mosaic.accountservice.account.dto.AccountResponse;
import com.mosaic.accountservice.account.dto.AccountTransactionSearchRequest;
import com.mosaic.accountservice.account.dto.AccountTransactionSearchResponse;
import com.mosaic.accountservice.account.service.AccountService;
import com.mosaic.accountservice.account.service.AccountTransactionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
public class AccountController {
	private final AccountService accountService;
	private final AccountTransactionService transactionService;

	@PostMapping
	public ResponseEntity<Void> createAccount(@RequestHeader("X-MEMBER-ID") Integer memberId,
		@RequestHeader(value = "X-INTERNAL-CALL", required = false) Boolean isInternal) {
		if (!Boolean.TRUE.equals(isInternal)) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "잘못된 호출입니다.");
		}
		accountService.createAccount(memberId);
		return ResponseEntity.ok().build();
	}

	@GetMapping
	public ResponseEntity<AccountResponse> getAccount(@RequestHeader("X-MEMBER-ID") Integer memberId) {
		return ResponseEntity.ok(new AccountResponse(accountService.getCurrentCash(memberId)));
	}

	@PostMapping("/transactions/search")
	public AccountTransactionSearchResponse searchTransactions(@RequestHeader("X-MEMBER-ID") Integer memberId,
		@RequestBody AccountTransactionSearchRequest request) {
		return transactionService.searchTransactions(request, memberId);
	}
}

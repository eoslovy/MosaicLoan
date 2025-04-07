package com.mosaic.accountservice.account.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

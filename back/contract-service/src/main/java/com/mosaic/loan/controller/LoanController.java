package com.mosaic.loan.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.loan.dto.CreateLoanRequestDto;
import com.mosaic.loan.dto.RepayLoanDto;
import com.mosaic.loan.service.LoanService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("loans")
public class LoanController {

	private final LoanService loanService;

	//TODO 돈 빌리기
	@PostMapping("request/test")
	public ResponseEntity<Void> requestLoan(@RequestBody CreateLoanRequestDto createLoanRequestDto,
		@RequestHeader("X-IS-BOT") Boolean isBot) throws JsonProcessingException {
		loanService.createLoan(createLoanRequestDto, isBot);
		return ResponseEntity.accepted().build();
	}

	@PostMapping("repay/test/{id}")
	public ResponseEntity<Void> repayLoan(@RequestBody RepayLoanDto requestInvestmentDto,
		@RequestHeader("X-IS-BOT") Boolean isBot) throws
		JsonProcessingException {
		loanService.publishAndCalculateLoanRepayRequest(requestInvestmentDto, isBot);
		return ResponseEntity.accepted().build();
	}

	//TODO 내 대출내역 확인
	@GetMapping("C")
	public ResponseEntity<?> getLoans() {
		return null;
	}

	//TODO 내 개별 투자의 거래내역 확인
	@GetMapping("D")
	public ResponseEntity<?> getLoanTransactions() {
		return null;
	}
}

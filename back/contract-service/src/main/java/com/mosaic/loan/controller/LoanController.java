package com.mosaic.loan.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.core.util.TimeUtil;
import com.mosaic.loan.dto.CreateLoanRequestDto;
import com.mosaic.loan.dto.LoanOverviewResponse;
import com.mosaic.loan.dto.LoanSearchRequest;
import com.mosaic.loan.dto.LoanSearchResponse;
import com.mosaic.loan.dto.LoanTransactionsResponse;
import com.mosaic.loan.dto.RepayLoanDto;
import com.mosaic.loan.repository.LoanQueryRepository;
import com.mosaic.loan.service.LoanService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/loans")
public class LoanController {

	private final LoanService loanService;
	private final LoanQueryRepository loanQueryRepository;
	private final TimeUtil timeUtil;

	@PostMapping
	public ResponseEntity<Void> requestLoan(@RequestBody CreateLoanRequestDto createLoanRequestDto,
		@RequestHeader("X-IS-BOT") Boolean isBot) throws JsonProcessingException {

		loanService.createLoan(createLoanRequestDto,timeUtil.now(isBot), isBot);
		return ResponseEntity.accepted().build();
	}


	//TODO 내 대출내역 확인
	@GetMapping("/overview")
	public ResponseEntity<LoanOverviewResponse> getLoanOverview(@RequestHeader("X-MEMBER-ID") Integer memberId) {
		return ResponseEntity.ok(loanQueryRepository.getLoanOverview(memberId));
	}

	//TODO 내 개별 투자의 거래내역 확인
	// 대출 거래 내역 조회
	@PostMapping("/search")
	public ResponseEntity<LoanSearchResponse> getLoans(
		@RequestBody LoanSearchRequest request,
		@RequestHeader("X-MEMBER-ID") Integer memberId) {
		return ResponseEntity.ok(loanQueryRepository.searchLoans(request, memberId));
	}

	// 대출 단건 거래 내역 조회
	@GetMapping("/{loanId}/transactions")
	public ResponseEntity<LoanTransactionsResponse> getLoanTransactions(@PathVariable("loanId") Integer loanId) {
		return ResponseEntity.ok(loanQueryRepository.findContractsByLoanId(loanId));
	}
}

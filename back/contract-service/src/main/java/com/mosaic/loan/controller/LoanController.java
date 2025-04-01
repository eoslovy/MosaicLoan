package com.mosaic.loan.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mosaic.loan.dto.CreateLoanRequestDto;
import com.mosaic.loan.service.LoanService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("loans")
public class LoanController {

	LoanService loanService;
	//TODO 돈빌리기
	@PostMapping("")
	public String createLoan(CreateLoanRequestDto request) {
		loanService.createLoan(request);
		return null;
	}
}

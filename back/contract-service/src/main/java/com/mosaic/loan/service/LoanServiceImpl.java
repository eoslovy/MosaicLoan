package com.mosaic.loan.service;

import org.springframework.stereotype.Service;

import com.mosaic.loan.dto.CreateLoanRequestDto;
import com.mosaic.loan.repository.LoanRepository;

@Service
public class LoanServiceImpl implements LoanService {

	LoanRepository loanRepository;

	@Override
	public void createLoan(CreateLoanRequestDto request) {

	}
}

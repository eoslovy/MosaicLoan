package com.mosaic.loan.service;

import com.mosaic.loan.dto.CreateLoanRequestDto;

public interface LoanService {
    void createLoan(CreateLoanRequestDto request);
}

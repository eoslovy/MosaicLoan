package com.mosaic.loan.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.loan.dto.CreateLoanRequestDto;

public interface LoanService {
    void createLoan(CreateLoanRequestDto request) throws JsonProcessingException;
}

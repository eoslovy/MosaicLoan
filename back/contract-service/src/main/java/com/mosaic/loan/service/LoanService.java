package com.mosaic.loan.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.investment.dto.RequestInvestmentDto;
import com.mosaic.investment.dto.WithdrawalInvestmentDto;
import com.mosaic.loan.dto.CreateLoanRequestDto;
import com.mosaic.payload.AccountTransactionPayload;

public interface LoanService {
    void createLoan(CreateLoanRequestDto request) throws JsonProcessingException;


    //상환입금
    void publishAndCalculateLoanRepayRequest(RequestInvestmentDto requestDto) throws JsonProcessingException;

    void completeLoanRepayRequest(AccountTransactionPayload requestDto) throws Exception;

    void publishLoanWithdrawal(WithdrawalInvestmentDto requestDto) throws JsonProcessingException;

    void rollbackLoanWithdrawal(AccountTransactionPayload payload);

}

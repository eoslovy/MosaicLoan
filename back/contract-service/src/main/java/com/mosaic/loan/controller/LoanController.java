package com.mosaic.loan.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.investment.dto.RequestInvestmentDto;
import com.mosaic.loan.dto.CreateLoanRequestDto;
import com.mosaic.loan.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("loans")
public class LoanController {

    private final LoanService loanService;

    //TODO 돈 빌리기
    @PostMapping("request/test")
    public ResponseEntity<Void> requestLoan(@RequestBody CreateLoanRequestDto createLoanRequestDto) throws JsonProcessingException {
        loanService.createLoan(createLoanRequestDto);
        return ResponseEntity.accepted().build();
    }

    @PostMapping("repay/test/{id}")
    public ResponseEntity<Void> repayLoan(@RequestBody RequestInvestmentDto requestInvestmentDto, @PathVariable("id") String id) throws JsonProcessingException {
        loanService.publishAndCalculateLoanRepayRequest(requestInvestmentDto);
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

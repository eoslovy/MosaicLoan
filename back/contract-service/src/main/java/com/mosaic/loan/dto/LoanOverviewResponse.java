package com.mosaic.loan.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import lombok.Builder;

@Builder
public record LoanOverviewResponse(
    List<RecentLoanInfo> recentLoans,
    long activeLoanCount,
    long totalCount,
    BigDecimal activeLoanAmount,
    int averageInterestRate
) {
    @Builder
    public record RecentLoanInfo(
        LocalDate dueDate,
        BigDecimal amount,
        int interestRate,
        BigDecimal outstandingAmount
    ) {}
} 
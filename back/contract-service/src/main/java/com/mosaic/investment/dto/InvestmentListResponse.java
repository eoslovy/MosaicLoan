package com.mosaic.investment.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import lombok.Builder;

@Builder
public record InvestmentListResponse(
    List<InvestmentInfo> investmentList
) {
    @Builder
    public record InvestmentInfo(
        Integer investmentId,             // 투자 ID
        BigDecimal investmentAmount,      // 투자 금액
        double rate,                      // 금리 (퍼센트)
        LocalDate dueDate,                // 만기일
        String status                     // 투자 상태
    ) {}
} 
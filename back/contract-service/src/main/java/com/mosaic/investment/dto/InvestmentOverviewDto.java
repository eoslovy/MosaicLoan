package com.mosaic.investment.dto;

import java.math.BigDecimal;
import java.util.Map;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class InvestmentOverviewDto {
    private Map<String, Long> statusDistribution;
    private Integer totalContractCount;
    private BigDecimal totalProfit;
    private BigDecimal totalLoss;
} 
package com.mosaic.investment.dto;

import java.math.BigDecimal;

public record ApprovedInvestmentDto(
        Integer id,
        BigDecimal principal,
        Integer targetRate,
        Integer targetWeeks
) {
}

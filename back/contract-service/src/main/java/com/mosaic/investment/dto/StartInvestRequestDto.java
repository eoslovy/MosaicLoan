package com.mosaic.investment.dto;

import java.math.BigDecimal;

public record StartInvestRequestDto(
	Integer id,
	BigDecimal principal,
	Integer targetRate,
	Integer targetMonth
) {}
package com.mosaic.statistics.dto;

import java.math.BigDecimal;

public record RateCountDto(
	BigDecimal actualRate,
	int count
) {}

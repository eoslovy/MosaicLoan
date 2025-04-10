package com.mosaic.investment.dto;

import java.time.LocalDateTime;
import java.util.Map;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class InvestmentWithStatusDto {
	private Integer investmentId;
	private LocalDateTime createdAt;
	private String investStatus;
	private Map<String, Long> statusDistribution;
	private Integer contractCount;
} 
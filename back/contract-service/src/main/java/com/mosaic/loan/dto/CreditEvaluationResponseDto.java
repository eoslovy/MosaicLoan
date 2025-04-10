package com.mosaic.loan.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CreditEvaluationResponseDto {
	private Integer id;
	private Integer memberId;
	private Integer defaultRate;
	private Integer interestRate;
	private Integer expectYield;
	private Integer maxLoanLimit;
	private LocalDateTime createdAt;
	private Integer caseId;
	private EvaluationStatus status;
	private Boolean defaultFlag;
} 
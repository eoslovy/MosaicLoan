package com.mosaic.loan.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CreditEvaluationResponseDto {
    private Integer id;
    private Integer memberId;
    private Integer defaultRate;
    private Integer interestRate;
    private Integer maxLoanLimit;
    private LocalDateTime createdAt;
    private Integer caseId;
    private EvaluationStatus status;
} 
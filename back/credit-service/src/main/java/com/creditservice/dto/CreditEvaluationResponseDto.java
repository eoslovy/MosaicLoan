package com.creditservice.dto;

import java.time.LocalDateTime;

import com.creditservice.domain.EvaluationStatus;

import lombok.Builder;
import lombok.Getter;

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
    private Boolean defaultFlag;
} 
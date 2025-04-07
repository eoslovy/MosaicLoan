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
    private Integer expectedYield; //기대수익 <-이거기준으로 투자
    private Integer interestRate;  //실제수익 (실패시 손실 미반영)
    private Integer maxLoanLimit;
    private LocalDateTime createdAt;
    private Integer caseId;
    private EvaluationStatus status;
    private Boolean defaultFlag;
} 
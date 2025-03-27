package com.mosaic.credit.evaluation.dto;

import lombok.Data;

@Data
public class EvaluationStartRequest {
    private String caseId;
    private Integer memberId;
} 
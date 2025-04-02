package com.mosaic.credit.data.dto;

import java.util.Map;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EvaluationResult {
    private String caseId;
    private Integer memberId;
    private String source;
    private Map<String, Object> payload;
    private boolean notFound;

    public static EvaluationResult notFound(String caseId, Integer memberId, String source) {
        return EvaluationResult.builder()
            .caseId(caseId)
            .memberId(memberId)
            .source(source)
            .notFound(true)
            .build();
    }

    public static EvaluationResult found(String caseId, Integer memberId, String source, Map<String, Object> payload) {
        return EvaluationResult.builder()
            .caseId(caseId)
            .memberId(memberId)
            .source(source)
            .payload(payload)
            .notFound(false)
            .build();
    }
} 
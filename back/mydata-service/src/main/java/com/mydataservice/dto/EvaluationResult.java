package com.mydataservice.dto;

import java.time.LocalDateTime;
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
	private LocalDateTime createdAt;

	public static EvaluationResult notFound(String caseId, Integer memberId, String source, LocalDateTime createdAt) {
		return EvaluationResult.builder()
			.caseId(caseId)
			.memberId(memberId)
			.source(source)
			.notFound(true)
			.createdAt(createdAt)
			.build();
	}

	public static EvaluationResult found(String caseId, Integer memberId, String source, Map<String, Object> payload,
		LocalDateTime createdAt) {
		return EvaluationResult.builder()
			.caseId(caseId)
			.memberId(memberId)
			.source(source)
			.payload(payload)
			.notFound(false)
			.createdAt(createdAt)
			.build();
	}
} 
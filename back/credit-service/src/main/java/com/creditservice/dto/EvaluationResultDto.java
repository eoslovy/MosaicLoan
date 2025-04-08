package com.creditservice.dto;

import java.time.LocalDateTime;
import java.util.Map;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class EvaluationResultDto {
	private String caseId;
	private String memberId;
	private String source;
	private Map<String, Object> payload;
	private boolean notFound;
	private LocalDateTime createdAt;

	public static EvaluationResultDto notFound(String caseId, String memberId, String source, LocalDateTime now) {
		EvaluationResultDto dto = new EvaluationResultDto();
		dto.setCaseId(caseId);
		dto.setMemberId(memberId);
		dto.setSource(source);
		dto.setNotFound(true);
		dto.setCreatedAt(now);
		return dto;
	}

	public static EvaluationResultDto found(String caseId, String memberId, String source,
		Map<String, Object> payload, LocalDateTime now) {
		EvaluationResultDto dto = new EvaluationResultDto();
		dto.setCaseId(caseId);
		dto.setMemberId(memberId);
		dto.setSource(source);
		dto.setPayload(payload);
		dto.setNotFound(false);
		dto.setCreatedAt(now);
		return dto;
	}
}


package com.mosaic.credit.evaluation.dto;

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

	public static EvaluationResultDto notFound(String caseId, String memberId, String source) {
		EvaluationResultDto dto = new EvaluationResultDto();
		dto.setCaseId(caseId);
		dto.setMemberId(memberId);
		dto.setSource(source);
		dto.setNotFound(true);
		return dto;
	}

	public static EvaluationResultDto found(String caseId, String memberId, String source, Map<String, Object> payload) {
		EvaluationResultDto dto = new EvaluationResultDto();
		dto.setCaseId(caseId);
		dto.setMemberId(memberId);
		dto.setSource(source);
		dto.setPayload(payload);
		dto.setNotFound(false);
		return dto;
	}
}


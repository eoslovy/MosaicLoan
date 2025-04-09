package com.creditservice.service;

import java.util.List;
import java.util.Map;

import com.creditservice.dto.EvaluationResultDto;

public interface EvaluationRedisService {
	boolean isAlreadyReceived(String caseId, String source);

	void saveReceivedSource(String caseId, String source);

	void savePayload(String caseId, String source, EvaluationResultDto result);

	void saveTimestampIfAbsent(String caseId);

	int getReceivedCount(String caseId);

	Map<String, Object> collectAllPayloads(String caseId, List<String> sources);

	EvaluationResultDto getPayload(String caseId, String source);

	void cleanup(String caseId, List<String> sources);
} 
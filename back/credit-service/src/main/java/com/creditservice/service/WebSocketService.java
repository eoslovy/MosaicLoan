package com.creditservice.service;

import com.creditservice.domain.EvaluationStatus;
import com.fasterxml.jackson.core.JsonProcessingException;

public interface WebSocketService {
	void sendEvaluationComplete(Integer memberId, EvaluationStatus status) throws JsonProcessingException;
} 
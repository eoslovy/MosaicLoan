package com.creditservice.service;

import com.fasterxml.jackson.core.JsonProcessingException;

public interface WebSocketService {
	void sendEvaluationComplete(Integer memberId) throws JsonProcessingException;
} 
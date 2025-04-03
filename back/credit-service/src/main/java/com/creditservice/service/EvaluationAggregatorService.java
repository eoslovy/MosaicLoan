package com.creditservice.service;

import com.creditservice.dto.EvaluationResultDto;

public interface EvaluationAggregatorService {
    void handleIncomingResult(EvaluationResultDto result);
} 
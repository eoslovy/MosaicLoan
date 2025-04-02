package com.mosaic.credit.evaluation.service;

import com.mosaic.credit.evaluation.dto.EvaluationResultDto;

public interface EvaluationAggregatorService {
    void handleIncomingResult(EvaluationResultDto result);
} 
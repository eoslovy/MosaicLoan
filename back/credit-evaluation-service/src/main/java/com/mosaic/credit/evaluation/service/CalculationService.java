package com.mosaic.credit.evaluation.service;

import com.mosaic.credit.evaluation.domain.CreditEvaluation;

public interface CalculationService {
    CreditEvaluation evaluateCredit(Integer caseId, Integer memberId, double probability);
} 
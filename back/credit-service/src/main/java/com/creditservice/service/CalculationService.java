package com.creditservice.service;

import com.creditservice.domain.CreditEvaluation;

public interface CalculationService {
    CreditEvaluation evaluateCredit(Integer caseId, Integer memberId, double probability);
} 
package com.mosaic.credit.evaluation.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mosaic.credit.evaluation.domain.CreditEvaluation;

public interface CreditEvaluationRepository extends JpaRepository<CreditEvaluation, Integer> {
}

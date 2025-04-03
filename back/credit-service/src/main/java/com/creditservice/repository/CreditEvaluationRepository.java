package com.creditservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.creditservice.domain.CreditEvaluation;

public interface CreditEvaluationRepository extends JpaRepository<CreditEvaluation, Integer> {
}

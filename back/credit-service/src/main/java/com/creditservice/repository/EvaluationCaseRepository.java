package com.creditservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.creditservice.domain.EvaluationCase;

public interface EvaluationCaseRepository extends JpaRepository<EvaluationCase, Integer> {

	// 사용 가능한 case_id 하나 가져오기
	Optional<EvaluationCase> findFirstByIsCheckedFalse();
}
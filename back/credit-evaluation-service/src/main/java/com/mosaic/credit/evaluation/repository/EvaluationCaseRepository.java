package com.mosaic.credit.evaluation.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.mosaic.credit.evaluation.domain.EvaluationCase;

public interface EvaluationCaseRepository extends JpaRepository<EvaluationCase, Integer> {

	// 사용 가능한 case_id 하나 가져오기
	Optional<EvaluationCase> findFirstByIsCheckedFalse();

	// case_id로 is_checked = true로 업데이트
	@Modifying
	@Query("update EvaluationCase e set e.isChecked = true where e.caseId = :caseId")
	void markAsChecked(Integer caseId);
}
package com.creditservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.creditservice.domain.CreditEvaluation;

@Repository
public interface CreditEvaluationRepository extends JpaRepository<CreditEvaluation, Integer> {
	List<CreditEvaluation> findByMemberIdOrderByCreatedAtDesc(Integer memberId);

	Optional<CreditEvaluation> findTopByMemberIdOrderByCreatedAtDesc(Integer memberId);
}

package com.creditservice.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "credit_evaluation")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class CreditEvaluation {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "member_id", nullable = false)
	private Integer memberId;

	@Column(name = "default_rate", nullable = false)
	private Integer defaultRate;

	@Column(name = "interest_rate", nullable = false)
	private Integer interestRate;

	@Column(name = "max_loan_limit", nullable = false)
	private Integer maxLoanLimit;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	@Column(name = "case_id", nullable = false)
	private Integer caseId;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false)
	private EvaluationStatus status;
}

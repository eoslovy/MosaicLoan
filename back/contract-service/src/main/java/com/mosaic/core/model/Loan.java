package com.mosaic.core.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "loan", schema = "mosaic_contract")
public class Loan {
	@Id
	@Column(name = "id", nullable = false)
	private Integer id;

	@Column(name = "account_id", nullable = false)
	private Integer accountId;

	@Column(name = "evaluation_id", nullable = false)
	private Integer evaluationId;

	@Column(name = "request_amount", precision = 18, scale = 5)
	private BigDecimal requestAmount;

	@Column(name = "amount", precision = 18, scale = 5)
	private BigDecimal amount;

	@Column(name = "due_date")
	private LocalDate dueDate;

	@Lob
	@Column(name = "status")
	private String status;

	@Column(name = "created_at")
	private Instant createdAt;

}
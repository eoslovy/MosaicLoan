package com.mosaic.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "investment", schema = "mosaic_contract")
public class Investment {
	@Id
	@Column(name = "id", nullable = false)
	private Integer id;

	@Column(name = "account_id", nullable = false)
	private Integer accountId;

	@Column(name = "target_rate")
	private Integer targetRate;

	@Column(name = "current_rate")
	private Integer currentRate;

	@Column(name = "amount", precision = 10)
	private BigDecimal amount;

	@Column(name = "due_date")
	private LocalDate dueDate;

	@Column(name = "created_at")
	private Instant createdAt;

	@Column(name = "principal", precision = 10)
	private BigDecimal principal;

}
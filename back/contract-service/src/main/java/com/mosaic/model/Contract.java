package com.mosaic.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "contract", schema = "mosaic_contract")
public class Contract {
	@Id
	@Column(name = "id", nullable = false)
	private Integer id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "loan_id", nullable = false)
	private Loan loan;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "investment_id", nullable = false)
	private Investment investment;

	@Lob
	@Column(name = "status")
	private String status;

	@Column(name = "amount", precision = 10)
	private BigDecimal amount;

	@Column(name = "outstanding_amount", precision = 10)
	private BigDecimal outstandingAmount;

	@Column(name = "paid_amount", precision = 10)
	private BigDecimal paidAmount;

	@Column(name = "delinquency_margin_rate")
	private Integer delinquencyMarginRate;

	@Column(name = "interest_rate")
	private Integer interestRate;

	@Column(name = "due_date")
	private LocalDate dueDate;

	@Column(name = "created_at")
	private Instant createdAt;

}
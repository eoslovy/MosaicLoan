package com.mosaic.core.model;

import com.mosaic.core.model.status.LoanStatus;
import com.mosaic.loan.dto.CreateLoanRequestDto;
import com.mosaic.loan.dto.CreditEvaluationResponseDto;
import com.mosaic.payload.AccountTransactionPayload;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "loan", schema = "mosaic_contract")
public class Loan {
	@Id
	@Column(name = "id", nullable = false)
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "account_id", nullable = false)
	private Integer accountId;

	@Column(name = "evaluation_id", nullable = false)
	private Integer evaluationId;

	@Column(name = "request_amount", precision = 18, scale = 5)
	private BigDecimal requestAmount;

	@Column(name = "amount", precision = 18, scale = 5)
	private BigDecimal amount;
	@Builder.Default
	@OneToMany(mappedBy = "loan", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = false)
	private List<Contract> contracts = new ArrayList<>();

	@Column(name = "due_date")
	private LocalDate dueDate;

	@Enumerated(EnumType.STRING)
	@Column(name = "status")
	private LoanStatus status;

	@Column(name = "created_at")
	private LocalDateTime createdAt;

	public static Loan requestOnlyFormLoan(CreateLoanRequestDto request,
		CreditEvaluationResponseDto creditEvaluationResponseDto, Integer memberId, LocalDateTime now) {
		return Loan.builder()
			.accountId(memberId)
			.amount(BigDecimal.valueOf(0))
			.createdAt(now)
			.dueDate(now.plusWeeks(request.targetWeeks()).toLocalDate())
			.evaluationId(creditEvaluationResponseDto.getId())
			.requestAmount(request.requestAmount())
			.status(LoanStatus.PENDING)
			.build();
	}

	public BigDecimal withdrawAll() {
		BigDecimal amount = this.amount;
		this.amount = BigDecimal.ZERO;
		return amount;
	}

	public void startLoan(BigDecimal amount) {
		this.amount = amount;
		this.status = LoanStatus.IN_PROGRESS;
	}

	public void finishLoan() {
		this.status = LoanStatus.COMPLETED;
	}

	public void setStatusDelinquent() {
		this.status = LoanStatus.DELINQUENT;
	}

	public void rollBack(BigDecimal amount) {
		this.amount = amount;
	}

	public void addContracts(List<Contract> newContracts) {
		for (Contract contract : newContracts) {
			contract.setLoan(this);
			this.contracts.add(contract);
		}
	}

	public void setStatusComplete() {
		this.status = LoanStatus.COMPLETED;
	}

	public void addAmount(AccountTransactionPayload accountTransactionComplete) {
		this.amount = this.amount.add(accountTransactionComplete.amount());
	}

	public void repay(BigDecimal repaidAmountResidue) {
		this.amount = repaidAmountResidue;
	}

	public void liquidate() {
		this.status = LoanStatus.TRANSFERRED;
	}
}
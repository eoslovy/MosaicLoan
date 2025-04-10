package com.mosaic.core.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.mosaic.core.model.status.ContractStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
@Table(name = "contract", schema = "mosaic_contract")
public class Contract {
	@Id
	@Column(name = "id", nullable = false)
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "loan_id", nullable = false)
	private Loan loan;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "investment_id", nullable = false)
	private Investment investment;
	@Builder.Default
	@OneToMany(mappedBy = "contract", cascade = CascadeType.ALL, orphanRemoval = false)
	private List<ContractTransaction> contractTransactions = new ArrayList<>();

	@Enumerated(EnumType.STRING)
	@Column(name = "status")
	private ContractStatus status;

	@Column(name = "amount", precision = 18, scale = 5)
	private BigDecimal amount;

	@Column(name = "outstanding_amount", precision = 18, scale = 5)
	private BigDecimal outstandingAmount;

	@Column(name = "paid_amount", precision = 18, scale = 5)
	private BigDecimal paidAmount;

	@Column(name = "delinquency_margin_rate")
	private Integer delinquencyMarginRate;

	@Column(name = "expect_yield")
	private BigDecimal expectYield;

	@Column(name = "interest_rate")
	private Integer interestRate;

	@Column(name = "due_date")
	private LocalDate dueDate;

	@Column(name = "created_at")
	private LocalDateTime createdAt;

	public static boolean isComeplete(Contract contract) {
		if (contract.getStatus().equals(ContractStatus.COMPLETED)) {
			return true;
		}
		return contract.getStatus().equals(ContractStatus.OWNERSHIP_TRANSFERRED);
	}

	public static Contract create(
		Loan loan,
		Investment investment,
		BigDecimal allocatedAmount,
		int interestRate,
		int delinquencyMarginRate,
		int expectYieldRate) {
		return Contract.builder()
			.loan(loan)
			.investment(investment)
			.amount(allocatedAmount)
			.outstandingAmount(allocatedAmount)
			.paidAmount(BigDecimal.ZERO)
			.interestRate(interestRate)
			.expectYield(
				allocatedAmount.multiply(BigDecimal.valueOf(expectYieldRate)).divide(BigDecimal.valueOf(10000)))
			.delinquencyMarginRate(delinquencyMarginRate)
			.status(ContractStatus.IN_PROGRESS)
			.dueDate(loan.getDueDate())
			// Bot 여부 판정이 어려워 일단 loan + 1~2초 사용
			.createdAt(loan.getCreatedAt().plusSeconds(1000 + (long)(Math.random() * 1000)))
			.build();
	}

	public void addInterestAmountToOutstandingAmount(BigDecimal interest) {
		this.outstandingAmount = this.outstandingAmount.add(interest);
	}

	public void updateOutstandingAmountAfterInterestRepaid(BigDecimal calculatedTotalInterest,
		BigDecimal repaidInterest) {
		this.outstandingAmount = this.outstandingAmount.add(amount).subtract(repaidInterest);
	}

	public void putTransaction(ContractTransaction transaction) {
		transaction.setContract(this);
		contractTransactions.add(transaction);
	}

	public void setStatusLiquidate() {
		this.status = ContractStatus.OWNERSHIP_TRANSFERRED;
	}

	public void updateOutstandingAmountAfterPrincipalRepaid(ContractTransaction principalTransaction) {
		this.outstandingAmount = this.outstandingAmount.subtract(principalTransaction.getAmount());
	}

	public void setLoan(Loan loan) {
		this.loan = loan;
	}

	public void setStatusDelinquent() {
		this.status = ContractStatus.DELINQUENT;
	}

	public void setStatusComplete() {
		this.status = ContractStatus.COMPLETED;
	}

	public void addExtraInterestDaily() {

		Integer totalRate = (interestRate + delinquencyMarginRate) / 365;
		this.outstandingAmount = this.outstandingAmount.multiply(BigDecimal.valueOf(totalRate))
			.divide(BigDecimal.valueOf(10000));
	}
}
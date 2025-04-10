package com.mosaic.core.model;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

import com.mosaic.core.model.status.ContractTransactionType;

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
@Table(name = "contract_transaction", schema = "mosaic_contract")
public class ContractTransaction {
	@Id
	@Column(name = "id", nullable = false)
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false, cascade = CascadeType.ALL)
	@JoinColumn(name = "contract_id", nullable = false)
	private Contract contract;

	@Column(name = "amount")
	private BigDecimal amount;

	@Enumerated(EnumType.STRING)
	@Column(name = "type")
	private ContractTransactionType type;

	@Column(name = "created_at")
	private LocalDateTime createdAt;

	public static ContractTransaction buildLiquidateTransaction(Contract contract, LocalDateTime now) {
		return builder()
			.contract(contract)
			.amount(contract.getOutstandingAmount().divide(BigDecimal.valueOf(2), 18, RoundingMode.DOWN))
			.createdAt(now)
			.type(ContractTransactionType.OWNERSHIP_TRANSFER)
			.build();
	}

	public static ContractTransaction buildRepayPrincipalTransaction(Contract contract, BigDecimal repaidAmount,
		LocalDateTime now) {
		return ContractTransaction.builder()
			.contract(contract)
			.amount(repaidAmount)
			.createdAt(now)
			.type(ContractTransactionType.PRINCIPAL)
			.build();
	}

	public static ContractTransaction buildRepayInterestTransaction(Contract contract, BigDecimal repaidAmount,
		LocalDateTime now) {
		return ContractTransaction.builder()
			.contract(contract)
			.amount(repaidAmount)
			.createdAt(now)
			.type(ContractTransactionType.INTEREST)
			.build();
	}

	public static ContractTransaction buildLoanCreateTransaction(Contract contract, BigDecimal amount,
		LocalDateTime now) {
		return ContractTransaction.builder()
			.contract(contract)
			.amount(amount)
			.type(ContractTransactionType.LOAN)
			.createdAt(now)
			.build();
	}

	public void setContract(Contract contract) {
		this.contract = contract;
	}
}
package com.mosaic.core.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.mosaic.core.model.status.InvestmentStatus;
import com.mosaic.core.util.TimeUtil;
import com.mosaic.investment.dto.RequestInvestmentDto;
import com.mosaic.payload.AccountTransactionPayload;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
@Table(name = "investment", schema = "mosaic_contract")
public class Investment {
	@Id
	@Column(name = "id", nullable = false)
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "account_id", nullable = false)
	private Integer accountId;

	@Column(name = "target_rate")
	private Integer targetRate;

	@Column(name = "current_rate")
	private Integer currentRate;

	@Column(name = "amount", precision = 18, scale = 5)
	private BigDecimal amount;

	@Column(name = "due_date")
	private LocalDate dueDate;

	@Column(name = "created_at")
	private LocalDateTime createdAt;

	@Column(name = "principal", precision = 18, scale = 5)
	private BigDecimal principal;

	@Builder.Default
	@OneToMany(mappedBy = "investment", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<Contract> contracts = new ArrayList<>();

	@Enumerated(EnumType.STRING)
	@Column(name = "status")
	private InvestmentStatus status;

	public static Investment requestOnlyFormInvestment(RequestInvestmentDto requestDto, Integer memberId,
		LocalDateTime now) {
		return Investment.builder()
			.status(InvestmentStatus.REQUESTED)
			.targetRate(requestDto.targetRate())
			.currentRate(0)
			.dueDate(TimeUtil.dueDate(now, requestDto.targetWeeks()))
			.accountId(memberId)
			.principal(requestDto.principal())
			.amount(BigDecimal.valueOf(0))
			.createdAt(now)
			.build();
	}

	public void completeRequest(AccountTransactionPayload transactionPayload) {
		this.amount = transactionPayload.amount();
		this.principal = transactionPayload.amount();
		this.status = InvestmentStatus.ACTIVE;
	}

	public void finishInvestment() {
		this.status = InvestmentStatus.COMPLETED;
	}

	public void unFinishInvestment() {
		this.status = InvestmentStatus.ACTIVE;
	}

	public BigDecimal withdrawAll() {
		BigDecimal amount = this.amount;
		this.amount = BigDecimal.ZERO;
		return amount;
	}

	public void rollBack(BigDecimal amount) {
		this.amount = amount;
	}

	public void investAmount(Contract contract) {
		this.contracts.add(contract);
		this.amount = amount.subtract(contract.getAmount());
	}
}
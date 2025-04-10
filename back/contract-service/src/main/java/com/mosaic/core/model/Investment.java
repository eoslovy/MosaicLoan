package com.mosaic.core.model;

import com.mosaic.core.model.status.InvestmentStatus;
import com.mosaic.core.util.TimeUtil;
import com.mosaic.investment.dto.RequestInvestmentDto;
import com.mosaic.payload.AccountTransactionPayload;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

	@Column(name = "expect_yield", precision = 18, scale = 5)
	private BigDecimal expectYield;

	@Builder.Default
	@OneToMany(mappedBy = "investment", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = false)
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
			.expectYield(BigDecimal.ZERO)
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

	public void subtractLiquidatedAmount(ContractTransaction transaction) {
		this.amount = this.amount.add(transaction.getAmount());
		this.currentRate = this.currentRate - transaction.getAmount()
			.divide(this.principal, 5, BigDecimal.ROUND_DOWN)
			.multiply(BigDecimal.valueOf(10000))
			.intValue();
	}

	public void subtractExpectYield(Contract contract) {
		this.expectYield = this.expectYield.subtract(contract.getExpectYield());
	}

	public void addExpectYield(Contract contract) {
		this.expectYield = this.expectYield.add(contract.getExpectYield());
	}

	public void addCurrentRate(ContractTransaction interestTransaction, Contract contract) {
		Integer adjustedRate = interestTransaction.getAmount()
			.divide(this.principal, 5, RoundingMode.DOWN)
			.multiply(BigDecimal.valueOf(10000))
			.intValue(); //원금대비 이자액을 비율로 환산
		this.currentRate = this.currentRate + adjustedRate;
	}
}
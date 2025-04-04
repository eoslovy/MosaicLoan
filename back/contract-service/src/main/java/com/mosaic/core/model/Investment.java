package com.mosaic.core.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.mosaic.core.util.TimeUtil;
import com.mosaic.investment.dto.RequestInvestmentDto;
import com.mosaic.payload.AccountTransactionPayload;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

	public static Investment requestOnlyFormInvestment(RequestInvestmentDto requestDto) {
		return Investment.builder()
			.targetRate(requestDto.targetRate())
			.currentRate(0)
			.dueDate(TimeUtil.dueDate(TimeUtil.nowDate(), requestDto.targetMonth()))
			.accountId(requestDto.id())
			.principal(BigDecimal.valueOf(0))
			.amount(BigDecimal.valueOf(0))
			.createdAt(TimeUtil.now())
			.build();
	}

	public void completeRequest(AccountTransactionPayload transactionPayload) {
		this.amount = transactionPayload.amount();
		this.principal = transactionPayload.amount();
	}
}
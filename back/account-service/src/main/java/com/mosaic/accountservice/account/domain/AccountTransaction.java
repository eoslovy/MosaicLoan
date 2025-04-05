package com.mosaic.accountservice.account.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.mosaic.accountservice.util.TimestampUtil;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "account_transaction")
@Getter
@NoArgsConstructor
public class AccountTransaction {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	private Integer accountId;

	@Enumerated(EnumType.STRING)
	private TransactionType type;

	// TransactionType 에 따라 달라지는 상대방 table 의 PK
	private Integer targetId;

	@Column(precision = 18, scale = 4)
	private BigDecimal amount;
	private String content;
	private LocalDateTime createdAt;
	@Column(precision = 18, scale = 4)
	private BigDecimal cash;

	private Integer compensationTargetId;

	private AccountTransaction(Integer accountId, TransactionType type, Integer targetId,
		BigDecimal amount, String content, BigDecimal cash, Integer compensationTargetId) {
		this.accountId = accountId;
		this.type = type;
		this.targetId = targetId;
		this.amount = amount;
		this.content = content;
		this.createdAt = TimestampUtil.getTimeStamp();
		this.cash = cash;
		this.compensationTargetId = compensationTargetId;
	}

	public static AccountTransaction record(Integer accountId, TransactionType type, Integer targetId,
		BigDecimal amount, String content, BigDecimal cash, Integer compensationTargetId) {
		if (accountId == null || type == null || targetId == null || amount == null
			|| content == null || cash == null) {
			throw new IllegalArgumentException("모든 필드는 null일 수 없습니다.");
		}
		
		if (type.isCompensation() && compensationTargetId == null) {
			throw new IllegalArgumentException("보상 트랜잭션은 대상이 되는 id가 명시되어야 합니다.");
		}

		if (amount.compareTo(BigDecimal.ZERO) <= 0) {
			throw new IllegalArgumentException("거래 금액은 0보다 커야 합니다.");
		}
		return new AccountTransaction(accountId, type, targetId, amount, content, cash, compensationTargetId);
	}
}

package com.mosaic.accountservice.external.model;

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
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ExternalWithdrawalTransaction {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "account_id", nullable = false)
	private Integer accountId;

	@Column(nullable = false, precision = 18, scale = 2)
	private BigDecimal amount;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	@Enumerated(EnumType.STRING)
	@Column(name = "bank_code", nullable = false, length = 3)
	private BankCode bankCode;

	@Column(name = "account_number", nullable = false, length = 14)
	private String accountNumber;

	public ExternalWithdrawalTransaction(Integer accountId, BigDecimal amount,
		BankCode bankCode,
		String accountNumber) {
		validateAccountNumber(accountNumber);
		validateAmount(amount);

		this.accountId = accountId;
		this.amount = amount;
		this.createdAt = TimestampUtil.getTimeStamp();
		this.bankCode = bankCode;
		this.accountNumber = accountNumber;

	}

	@Builder
	public static ExternalWithdrawalTransaction create(Integer accountId,
		BigDecimal amount,
		BankCode bankCode,
		String accountNumber) {
		return new ExternalWithdrawalTransaction(accountId, amount, bankCode, accountNumber);
	}

	private void validateAccountNumber(String accountNumber) {
		if (accountNumber == null || accountNumber.length() > 14) {
			throw new IllegalArgumentException("계좌번호는 최대 14자리까지 입력 가능합니다.");
		}

		if (!accountNumber.matches("^[0-9]+$")) {
			throw new IllegalArgumentException("계좌번호는 숫자만 입력 가능합니다.");
		}
	}

	private void validateAmount(BigDecimal amount) {
		if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
			throw new IllegalArgumentException("출금 금액은 0보다 커야 합니다.");
		}
	}
}

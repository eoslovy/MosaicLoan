package com.mosaic.accountservice.external.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class ExternalDepositTransaction {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Integer id;

	Integer accountId;
	@Column(precision = 18, scale = 4)
	BigDecimal amount;
	LocalDateTime createdAt;
	@Column(columnDefinition = "VARCHAR(20)")
	String externalTransactionId;

	@Builder
	public static ExternalDepositTransaction create(Integer accountId, BigDecimal amount,
		String externalTransactionId, String approvedAt) {
		ExternalDepositTransaction tx = new ExternalDepositTransaction();
		tx.accountId = accountId;
		tx.amount = amount;
		tx.createdAt = LocalDateTime.parse(approvedAt);
		tx.externalTransactionId = externalTransactionId;
		return tx;
	}
}

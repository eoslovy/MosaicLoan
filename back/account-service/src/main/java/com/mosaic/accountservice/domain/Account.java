package com.mosaic.accountservice.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.mosaic.accountservice.util.TimestampUtil;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "account")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Account {
	@Id
	private Integer id;
	private BigDecimal cash;
	private LocalDateTime createdAt;

	private Account(Integer memberId) {
		this.id = memberId;
		cash = BigDecimal.ZERO;
		this.createdAt = TimestampUtil.getTimeStamp();
	}

	public static Account create(Integer memberId) {
		return new Account(memberId);
	}

	public void updateCash(BigDecimal updatedCash) {
		this.cash = updatedCash;
	}
}
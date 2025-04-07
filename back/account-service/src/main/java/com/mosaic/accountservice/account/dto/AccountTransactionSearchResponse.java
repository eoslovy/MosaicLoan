package com.mosaic.accountservice.account.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.mosaic.accountservice.account.domain.AccountTransaction;
import com.mosaic.accountservice.account.domain.TransactionType;

import lombok.Builder;

@Builder
public record AccountTransactionSearchResponse(
	List<TransactionDto> transactions,
	Pagination pagination
) {

	@Builder
	public record TransactionDto(
		Integer targetId,
		String content,
		TransactionType type,
		BigDecimal amount,
		BigDecimal cash,
		LocalDateTime createdAt
	) {
		public static TransactionDto from(AccountTransaction tx) {
			return TransactionDto.builder()
				.targetId(tx.getTargetId())
				.content(tx.getContent())
				.type(tx.getType())
				.amount(tx.getAmount())
				.cash(tx.getCash())
				.createdAt(tx.getCreatedAt())
				.build();
		}
	}

	@Builder
	public record Pagination(
		int page,
		int pageSize,
		int totalPage,
		long totalItemCount
	) {
	}
}
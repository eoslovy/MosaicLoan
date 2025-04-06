package com.mosaic.accountservice.account.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.mosaic.accountservice.account.domain.AccountTransaction;
import com.mosaic.accountservice.account.domain.QAccountTransaction;
import com.mosaic.accountservice.account.domain.TransactionType;
import com.mosaic.accountservice.account.dto.AccountTransactionSearchRequest;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class AccountTransactionQueryRepositoryImpl implements AccountTransactionQueryRepository {

	private final JPAQueryFactory queryFactory;

	QAccountTransaction tx = QAccountTransaction.accountTransaction;

	@Override
	public List<AccountTransaction> search(AccountTransactionSearchRequest request, Integer memberId,
		Pageable pageable) {
		return queryFactory
			.selectFrom(tx)
			.where(
				tx.accountId.eq(memberId),
				createdAtGoe(request.startDate()),
				createdAtLoe(request.endDate()),
				typeIn(request.types())
			)
			.orderBy(tx.createdAt.desc())
			.offset(pageable.getOffset())
			.limit(pageable.getPageSize())
			.fetch();
	}

	@Override
	public long count(AccountTransactionSearchRequest request, Integer memberId) {
		var result = queryFactory
			.select(tx.count())
			.from(tx)
			.where(
				tx.accountId.eq(memberId),
				createdAtGoe(request.startDate()),
				createdAtLoe(request.endDate()),
				typeIn(request.types())
			)
			.fetchOne();
		return Optional.ofNullable(result).orElse(0L);
	}

	private BooleanExpression createdAtGoe(LocalDate startDate) {
		return startDate != null ? tx.createdAt.goe(startDate.atStartOfDay()) : null;
	}

	private BooleanExpression createdAtLoe(LocalDate endDate) {
		return endDate != null ? tx.createdAt.loe(endDate.atTime(23, 59, 59)) : null;
	}

	private BooleanExpression typeIn(List<TransactionType> types) {
		return (types == null || types.isEmpty()) ? null : tx.type.in(types);
	}
}

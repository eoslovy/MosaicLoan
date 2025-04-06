package com.mosaic.investment.repository;

import com.mosaic.core.model.Investment;
import com.mosaic.core.model.Loan;
import com.mosaic.core.model.QInvestment;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class InvestmentQueryRepositoryImpl implements InvestmentQueryRepository {

	private final JPAQueryFactory queryFactory;

	@Override
	public List<Investment> findQualifiedInvestments(BigDecimal minimumAmount, Loan loan) {
		QInvestment investment = QInvestment.investment;
		BigDecimal minAmount = BigDecimal.valueOf(100000);
		//돈에 대한 조건, 최소금액보다 분산금액이 커야할것, 최소금액보다 잔액이 커야할것
		BooleanExpression amountCondition = investment.principal.multiply(1.0 / 500)
			.goe(minimumAmount)
			.and(investment.amount.goe(minimumAmount));

		BooleanExpression rateCondition = investment.targetRate.gt(investment.currentRate);
		BooleanExpression dueDateCondition = investment.dueDate.loe(loan.getDueDate());

		return queryFactory.selectFrom(investment)
			.where(amountCondition, rateCondition, dueDateCondition)
			.orderBy(investment.amount.desc())
			.fetch();
	}
}

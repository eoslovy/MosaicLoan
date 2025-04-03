package com.mosaic.investment.repository;

import com.mosaic.core.model.Investment;
import com.mosaic.core.model.QInvestment;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class InvestmentQueryRepositoryImpl implements InvestmentQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<Investment> findQualifiedInvestments(BigDecimal minimumAmount, LocalDate loanDueDate) {
        QInvestment investment = QInvestment.investment;

        // 기준금액 = MAX(최소기준금액, 본인 원금 * 1/500)
        NumberExpression<BigDecimal> thresholdAmount =
                investment.principal.multiply(BigDecimal.valueOf(1.0 / 500)).max(minimumAmount);

        BooleanExpression condition = investment.amount.goe(thresholdAmount)
                .and(investment.targetRate.gt(investment.currentRate))
                .and(investment.dueDate.loe(loanDueDate));

        return queryFactory
                .selectFrom(investment)
                .where(condition)
                .orderBy(investment.amount.desc())
                .fetch();
    }
}

package com.mosaic.investment.repository;


import com.mosaic.core.model.Investment;
import com.mosaic.core.model.QInvestment;
import com.querydsl.core.types.dsl.BooleanExpression;
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
        BigDecimal minAmount = BigDecimal.valueOf(100000);

        BooleanExpression amountCondition = investment.amount.goe(minimumAmount)
                .or(investment.amount.goe(
                        investment.principal.multiply(1.0 / 500)
                ));

        BooleanExpression rateCondition = investment.targetRate.gt(investment.currentRate);
        BooleanExpression dueDateCondition = investment.dueDate.loe(loanDueDate);

        List<Investment> result = queryFactory
                .selectFrom(investment)
                .where(amountCondition, rateCondition, dueDateCondition)
                .orderBy(investment.amount.desc())
                .fetch();

        return queryFactory
                .selectFrom(investment)
                .where(amountCondition)
                .orderBy(investment.amount.desc())
                .fetch();
    }
}

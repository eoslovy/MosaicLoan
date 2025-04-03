package com.mosaic.investment.repository;

/*
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
*/
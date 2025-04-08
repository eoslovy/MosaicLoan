package com.mosaic.loan.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.mosaic.core.model.QContract;
import com.mosaic.core.model.QLoan;
import com.mosaic.loan.dto.LoanTransactionResponse;
import com.mosaic.loan.dto.LoanTransactionSearchRequest;
import com.mosaic.loan.dto.LoanTransactionsResponse;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class LoanQueryRepositoryImpl implements LoanQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public LoanTransactionResponse searchTransactions(LoanTransactionSearchRequest request, Integer memberId) {
        QLoan loan = QLoan.loan;
        QContract contract = QContract.contract;

        // 기본 조건 설정 (회원 ID로 필터링)
        BooleanExpression conditions = loan.accountId.eq(memberId);

        // 날짜 범위 조건
        if (request.startDate() != null) {
            conditions = conditions.and(loan.createdAt.goe(request.startDate().atStartOfDay()));
        }
        if (request.endDate() != null) {
            conditions = conditions.and(loan.createdAt.loe(request.endDate().atTime(23, 59, 59)));
        }

        // 대출 상태 필터링
        if (request.types() != null && !request.types().isEmpty()) {
            conditions = conditions.and(loan.status.in(request.types()));
        }

        // 정렬 조건 설정
        List<OrderSpecifier<?>> orders = new ArrayList<>();
        if (request.sort() != null) {
            for (LoanTransactionSearchRequest.SortCriteria sort : request.sort()) {
                switch (sort.field()) {
                    case "amount":
                        orders.add(sort.order().equals("asc") ? 
                            loan.amount.asc() : loan.amount.desc());
                        break;
                    case "createdAt":
                        orders.add(sort.order().equals("asc") ? 
                            loan.createdAt.asc() : loan.createdAt.desc());
                        break;
                    case "dueDate":
                        orders.add(sort.order().equals("asc") ? 
                            loan.dueDate.asc() : loan.dueDate.desc());
                        break;
                    case "interestRate":
                        orders.add(sort.order().equals("asc") ? 
                            contract.interestRate.asc() : contract.interestRate.desc());
                        break;
                }
            }
        }
        if (orders.isEmpty()) {
            orders.add(loan.createdAt.desc()); // 기본 정렬
        }

        // 전체 아이템 수 조회
        long totalCount = queryFactory
            .select(loan.count())
            .from(loan)
            .where(conditions)
            .fetchOne();

        // 페이지네이션 적용하여 데이터 조회
        int page = request.page();
        int pageSize = request.pageSize();
        
        List<LoanTransactionResponse.LoanInfo> loans = queryFactory
            .select(Projections.constructor(LoanTransactionResponse.LoanInfo.class,
                loan.id,
                loan.id,
                loan.amount.stringValue(),
                loan.requestAmount.stringValue(),
                contract.interestRate.stringValue(),
                loan.dueDate.stringValue(),
                loan.createdAt.stringValue(),
                loan.status.stringValue()))
            .from(loan)
            .leftJoin(contract).on(contract.loan.eq(loan))
            .where(conditions)
            .groupBy(loan.id, loan.amount, loan.requestAmount, loan.dueDate, loan.createdAt, loan.status, contract.interestRate)
            .orderBy(orders.toArray(new OrderSpecifier[0]))
            .offset((long) request.safePage() * pageSize)
            .limit(pageSize)
            .fetch();

        // 응답 생성
        return LoanTransactionResponse.builder()
            .pagination(LoanTransactionResponse.PaginationInfo.builder()
                .page(page)
                .pageSize(pageSize)
                .totalPage((int) Math.ceil((double) totalCount / pageSize))
                .totalItemCount(totalCount)
                .build())
            .loans(loans)
            .build();
    }

    @Override
    public LoanTransactionsResponse findContractsByLoanId(Integer loanId) {
        QContract contract = QContract.contract;
        QLoan loan = QLoan.loan;

        List<LoanTransactionsResponse.TransactionInfo> transactions = queryFactory
            .select(Projections.constructor(LoanTransactionsResponse.TransactionInfo.class,
                contract.id,
                loan.id,
                contract.amount.stringValue(),
                contract.createdAt.stringValue(),
                contract.status))
            .from(contract)
            .join(contract.loan, loan)
            .where(loan.id.eq(loanId))
            .orderBy(contract.createdAt.desc())
            .fetch();

        return LoanTransactionsResponse.builder()
            .transactions(transactions)
            .build();
    }
} 
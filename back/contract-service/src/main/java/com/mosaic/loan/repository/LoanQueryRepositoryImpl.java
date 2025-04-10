package com.mosaic.loan.repository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.mosaic.core.model.QContract;
import com.mosaic.core.model.QLoan;
import com.mosaic.core.model.status.LoanStatus;
import com.mosaic.loan.dto.LoanOverviewResponse;
import com.mosaic.loan.dto.LoanOverviewResponse.RecentLoanInfo;
import com.mosaic.loan.dto.LoanTransactionResponse;
import com.mosaic.loan.dto.LoanTransactionSearchRequest;
import com.mosaic.loan.dto.LoanTransactionsResponse;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
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
			.groupBy(loan.id, loan.amount, loan.requestAmount, loan.dueDate, loan.createdAt, loan.status,
				contract.interestRate)
			.orderBy(orders.toArray(new OrderSpecifier[0]))
			.offset((long)request.safePage() * pageSize)
			.limit(pageSize)
			.fetch();

		// 응답 생성
		return LoanTransactionResponse.builder()
			.pagination(LoanTransactionResponse.PaginationInfo.builder()
				.page(page)
				.pageSize(pageSize)
				.totalPage((int)Math.ceil((double)totalCount / pageSize))
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

	@Override
	public LoanOverviewResponse getLoanOverview(Integer memberId) {
		QLoan loan = QLoan.loan;
		QContract contract = QContract.contract;

		// 기본 조건 설정 (회원 ID로 필터링)
		BooleanExpression memberCondition = loan.accountId.eq(memberId);

		// 1. 전체 대출 건수 조회
		long totalCount = queryFactory
			.select(loan.count())
			.from(loan)
			.where(memberCondition)
			.fetchOne();

		// 2. 진행 중인 대출 건수 조회
		BooleanExpression activeCondition = loan.status.eq(LoanStatus.IN_PROGRESS);
		long activeLoanCount = queryFactory
			.select(loan.count())
			.from(loan)
			.where(memberCondition.and(activeCondition))
			.fetchOne();

		// 3. 진행 중인 대출 금액 합계 조회
		BigDecimal activeLoanAmount = queryFactory
			.select(loan.amount.sum())
			.from(loan)
			.where(memberCondition.and(activeCondition))
			.fetchOne();

		if (activeLoanAmount == null) {
			activeLoanAmount = BigDecimal.ZERO;
		}

		// 4. 평균 금리 계산
		List<Tuple> loans = queryFactory
			.select(loan.amount, loan.requestAmount)
			.from(loan)
			.where(memberCondition.and(activeCondition))
			.fetch();

		int averageInterestRate = 0;
		if (!loans.isEmpty()) {
			BigDecimal totalAmount = BigDecimal.ZERO;
			BigDecimal totalRequestAmount = BigDecimal.ZERO;

			for (Tuple t : loans) {
				BigDecimal amount = t.get(loan.amount);
				BigDecimal requestAmount = t.get(loan.requestAmount);

				if (amount != null && requestAmount != null && requestAmount.compareTo(BigDecimal.ZERO) > 0) {
					totalAmount = totalAmount.add(amount);
					totalRequestAmount = totalRequestAmount.add(requestAmount);
				}
			}

			if (totalRequestAmount.compareTo(BigDecimal.ZERO) > 0) {
				// (총 상환금액 - 총 원금) / 총 원금 * 10000
				BigDecimal interestAmount = totalAmount.subtract(totalRequestAmount);
				BigDecimal interestRate = interestAmount.divide(totalRequestAmount, 4, RoundingMode.HALF_UP)
					.multiply(BigDecimal.valueOf(10000));
				averageInterestRate = interestRate.intValue();
			}
		}

		// 5. 최근 대출 목록 5개 조회
		List<RecentLoanInfo> recentLoans = queryFactory
			.select(
				Projections.constructor(
					RecentLoanInfo.class,
					loan.dueDate,
					loan.amount,
					Expressions.numberTemplate(Integer.class,
						"CAST((({0} - {1}) / {1} * 10000) AS INTEGER)",
						loan.amount,
						loan.requestAmount),
					loan.amount
				)
			)
			.from(loan)
			.where(memberCondition)
			.orderBy(loan.createdAt.desc())
			.limit(5)
			.fetch();

		// 응답 생성
		return LoanOverviewResponse.builder()
			.recentLoans(recentLoans)
			.activeLoanCount(activeLoanCount)
			.totalCount(totalCount)
			.activeLoanAmount(activeLoanAmount)
			.averageInterestRate(averageInterestRate)
			.build();
	}
} 
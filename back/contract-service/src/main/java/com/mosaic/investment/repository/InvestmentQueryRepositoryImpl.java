package com.mosaic.investment.repository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.mosaic.core.model.Investment;
import com.mosaic.core.model.Loan;
import com.mosaic.core.model.QContract;
import com.mosaic.core.model.QInvestment;
import com.mosaic.core.model.status.ContractStatus;
import com.mosaic.investment.dto.InvestmentTransactionResponse;
import com.mosaic.investment.dto.InvestmentTransactionSearchRequest;
import com.mosaic.investment.dto.InvestmentWithStatusDto;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
@RequiredArgsConstructor
public class InvestmentQueryRepositoryImpl implements InvestmentQueryRepository {

	private final JPAQueryFactory queryFactory;

	@Override
	public List<Investment> findQualifiedInvestments(BigDecimal minimumAmount, Loan loan) {
		QInvestment investment = QInvestment.investment;
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

	@Override
	public List<InvestmentWithStatusDto> findInvestmentsWithStatusDistribution(Integer memberId) {
		QInvestment investment = QInvestment.investment;
		QContract contract = QContract.contract;

		try {
			// 1. 사용자의 모든 투자 정보 조회
			List<Investment> investments = queryFactory
				.selectFrom(investment)
				.where(investment.accountId.eq(memberId))
				.fetch();

			// 2. 각 투자별 계약 상태 분포 계산
			return investments.stream()
				.map(inv -> {
					try {
						// 2-1. 해당 투자에 연결된 모든 계약의 상태별 개수 조회
						Map<ContractStatus, Long> statusCount = new HashMap<>();
						
						try {
							List<Tuple> results = queryFactory
								.select(contract.status, contract.count())
								.from(contract)
								.where(contract.investment.id.eq(inv.getId()))
								.groupBy(contract.status)
								.fetch();
								
							for (Tuple tuple : results) {
								ContractStatus status = tuple.get(contract.status);
								Long count = tuple.get(contract.count());
								if (status != null && count != null) {
									statusCount.put(status, count);
								}
							}
						} catch (Exception e) {
							log.error("Error querying contract status: {}", e.getMessage(), e);
						}

						// 2-2. Map<ContractStatus, Long>을 Map<String, Long>으로 변환
						Map<String, Long> statusDistribution = new HashMap<>();
						
						// 모든 상태 유형에 대해 0으로 초기화
						for (ContractStatus status : ContractStatus.values()) {
							statusDistribution.put(status.name(), 0L);
						}
						
						// 실제 데이터로 업데이트 (statusCount가 null이 아닐 때만)
						if (statusCount != null) {
							statusCount.forEach((status, count) -> 
								statusDistribution.put(status.name(), count));
						}
							
						// 전체 계약 수 계산
						Integer contractCount = statusDistribution.values().stream()
							.mapToInt(Long::intValue)
							.sum();

						// 2-3. DTO 생성
						return InvestmentWithStatusDto.builder()
							.investmentId(inv.getId())
							.createdAt(inv.getCreatedAt())
							.investStatus(inv.getStatus() != null ? inv.getStatus().name() : "UNKNOWN")
							.statusDistribution(statusDistribution)
							.contractCount(contractCount)
							.build();
					} catch (Exception e) {
						log.error("Error processing investment {}: {}", inv.getId(), e.getMessage(), e);
						throw e;
					}
				})
				.collect(Collectors.toList());
		} catch (Exception e) {
			log.error("Error in findInvestmentsWithStatusDistribution: {}", e.getMessage(), e);
			throw e;
		}
	}

	@Override
	public InvestmentTransactionResponse searchTransactions(InvestmentTransactionSearchRequest request) {
		QInvestment investment = QInvestment.investment;
		QContract contract = QContract.contract;

		// 기본 조건 설정
		BooleanExpression conditions = contract.investment.isNotNull();

		// 날짜 범위 조건
		if (request.startDate() != null) {
			conditions = conditions.and(investment.createdAt.goe(request.startDate().atStartOfDay()));
		}
		if (request.endDate() != null) {
			conditions = conditions.and(investment.createdAt.loe(request.endDate().atTime(23, 59, 59)));
		}

		// 투자 ID 필터링
		if (request.investmentIds() != null && !request.investmentIds().isEmpty()) {
			conditions = conditions.and(investment.id.in(request.investmentIds()));
		}

		// 계약 상태 필터링
		if (request.types() != null && !request.types().isEmpty()) {
			conditions = conditions.and(contract.status.in(request.types()));
		}

		// 정렬 조건 설정
		List<OrderSpecifier<?>> orders = new ArrayList<>();
		if (request.sort() != null) {
			for (InvestmentTransactionSearchRequest.SortCriteria sort : request.sort()) {
				switch (sort.field()) {
					case "investmentId":
						orders.add(sort.order().equals("asc") ? 
							investment.id.asc() : investment.id.desc());
						break;
					case "contractId":
						orders.add(sort.order().equals("asc") ? 
							contract.id.asc() : contract.id.desc());
						break;
					case "createdAt":
						orders.add(sort.order().equals("asc") ? 
							investment.createdAt.asc() : investment.createdAt.desc());
						break;
				}
			}
		}
		if (orders.isEmpty()) {
			orders.add(investment.createdAt.desc()); // 기본 정렬
		}

		// 전체 아이템 수 조회
		long totalCount = queryFactory
			.select(contract.count())
			.from(contract)
			.join(contract.investment, investment)
			.where(conditions)
			.fetchOne();

		// 페이지네이션 적용하여 데이터 조회
		int page = request.page();
		int pageSize = request.pageSize();
		
		List<InvestmentTransactionResponse.TransactionInfo> transactions = queryFactory
			.select(Projections.constructor(InvestmentTransactionResponse.TransactionInfo.class,
				investment.id,
				contract.id,
				investment.id,
				contract.amount.stringValue(),
				contract.createdAt.stringValue(),
				contract.status.stringValue(),
				contract.interestRate,
				contract.dueDate.stringValue()))
			.from(contract)
			.join(contract.investment, investment)
			.where(conditions)
			.orderBy(orders.toArray(new OrderSpecifier[0]))
			.offset(page * pageSize)
			.limit(pageSize)
			.fetch();

		// 응답 생성
		return InvestmentTransactionResponse.builder()
			.pagination(InvestmentTransactionResponse.PaginationInfo.builder()
				.page(page)
				.pageSize(pageSize)
				.totalPage((int) Math.ceil((double) totalCount / pageSize))
				.totalItemCount(totalCount)
				.build())
			.transactions(transactions)
			.build();
	}
}

package com.mosaic.investment.repository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.mosaic.core.model.Investment;
import com.mosaic.core.model.Loan;
import com.mosaic.core.model.QContract;
import com.mosaic.core.model.QInvestment;
import com.mosaic.core.model.status.ContractStatus;
import com.mosaic.investment.dto.InvestmentOverviewDto;
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
	public List<Investment> findQualifiedInvestments(BigDecimal minimumAmount, Integer expectYieldRate, Loan loan) {
		QInvestment investment = QInvestment.investment;
		//돈에 대한 조건, 최소금액보다 분산금액이 커야할것, 최소금액보다 잔액이 커야할것
		BooleanExpression amountCondition = investment.principal.multiply(1.0 / 500)
			.goe(minimumAmount)
			.and(investment.amount.goe(minimumAmount));

		BooleanExpression rateCondition = investment.expectYield.divide(investment.principal).gt(expectYieldRate);
		BooleanExpression dueDateCondition = investment.dueDate.lt(loan.getDueDate());

		return queryFactory.selectFrom(investment)
			.where(amountCondition, rateCondition, dueDateCondition)
			.orderBy(investment.amount.desc())
			.fetch();
	}

	@Override
	public Map<String, Object> findInvestmentsWithOverview(Integer memberId) {
		QInvestment investment = QInvestment.investment;
		QContract contract = QContract.contract;

		try {
			// 1. 사용자의 모든 투자 정보와 각 투자별 계약 상태 분포 조회
			List<Investment> investments = queryFactory
				.selectFrom(investment)
				.where(investment.accountId.eq(memberId))
				.fetch();

			// 2. 상태 분포 초기화
			Map<String, Long> totalStatusDistribution = new HashMap<>();
			totalStatusDistribution.put("completed", 0L);
			totalStatusDistribution.put("active", 0L);
			totalStatusDistribution.put("default", 0L);
			totalStatusDistribution.put("transferred", 0L);

			int totalContractCount = 0;
			BigDecimal totalProfit = BigDecimal.ZERO;
			BigDecimal totalLoss = BigDecimal.ZERO;

			// 3. 각 투자에 대한 DTO 생성 및 통계 데이터 수집
			List<InvestmentWithStatusDto> investmentDtos = new ArrayList<>();

			for (Investment inv : investments) {
				try {
					// 3-1. 해당 투자에 연결된 모든 계약의 상태별 개수 조회
					Map<ContractStatus, Long> statusCount = new HashMap<>();

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

					// 3-2. 해당 투자의 수익/손실 계산
					// COMPLETED 계약의 수익 계산
					List<BigDecimal> completedResults = queryFactory
						.select(contract.paidAmount.subtract(contract.amount))
						.from(contract)
						.where(contract.investment.id.eq(inv.getId())
							.and(contract.status.eq(ContractStatus.COMPLETED)))
						.fetch();

					BigDecimal investmentProfit = BigDecimal.ZERO;
					for (BigDecimal profit : completedResults) {
						if (profit != null) {
							investmentProfit = investmentProfit.add(profit);
							totalProfit = totalProfit.add(profit);
						}
					}

					// OWNERSHIP_TRANSFERRED 계약의 손실 계산
					List<BigDecimal> lossResults = queryFactory
						.select(contract.amount.subtract(contract.paidAmount).divide(BigDecimal.valueOf(2)))
						.from(contract)
						.where(contract.investment.id.eq(inv.getId())
							.and(contract.status.eq(ContractStatus.OWNERSHIP_TRANSFERRED)))
						.fetch();

					BigDecimal investmentLoss = BigDecimal.ZERO;
					for (BigDecimal loss : lossResults) {
						if (loss != null) {
							investmentLoss = investmentLoss.add(loss);
							totalLoss = totalLoss.add(loss);
						}
					}

					// 3-3. Map<ContractStatus, Long>을 Map<String, Long>으로 변환
					Map<String, Long> statusDistribution = new HashMap<>();

					// 모든 상태 유형에 대해 0으로 초기화
					for (ContractStatus status : ContractStatus.values()) {
						statusDistribution.put(status.name(), 0L);
					}

					// 실제 데이터로 업데이트
					statusCount.forEach((status, count) ->
						statusDistribution.put(status.name(), count));

					// 3-4. 상태별 카운트 합산
					if (statusDistribution.containsKey("COMPLETED")) {
						totalStatusDistribution.put("completed",
							totalStatusDistribution.get("completed") + statusDistribution.get("COMPLETED"));
					}
					if (statusDistribution.containsKey("IN_PROGRESS")) {
						totalStatusDistribution.put("active",
							totalStatusDistribution.get("active") + statusDistribution.get("IN_PROGRESS"));
					}
					if (statusDistribution.containsKey("DELINQUENT")) {
						totalStatusDistribution.put("default",
							totalStatusDistribution.get("default") + statusDistribution.get("DELINQUENT"));
					}
					if (statusDistribution.containsKey("OWNERSHIP_TRANSFERRED")) {
						totalStatusDistribution.put("transferred",
							totalStatusDistribution.get("transferred") + statusDistribution.get(
								"OWNERSHIP_TRANSFERRED"));
					}

					// 3-5. 계약 수 계산 및 합산
					Integer contractCount = statusDistribution.values().stream()
						.mapToInt(Long::intValue)
						.sum();

					totalContractCount += contractCount;

					// 3-6. 투자 DTO 생성
					InvestmentWithStatusDto dto = InvestmentWithStatusDto.builder()
						.investmentId(inv.getId())
						.createdAt(inv.getCreatedAt())
						.investStatus(inv.getStatus() != null ? inv.getStatus().name() : "UNKNOWN")
						.statusDistribution(statusDistribution)
						.contractCount(contractCount)
						.build();

					investmentDtos.add(dto);
				} catch (Exception e) {
					log.error("Error processing investment {}: {}", inv.getId(), e.getMessage(), e);
				}
			}

			// 4. InvestmentOverviewDto 생성
			InvestmentOverviewDto overview = InvestmentOverviewDto.builder()
				.statusDistribution(totalStatusDistribution)
				.totalContractCount(totalContractCount)
				.totalProfit(totalProfit)
				.totalLoss(totalLoss)
				.build();

			// 5. 최종 결과 생성
			Map<String, Object> result = new HashMap<>();
			result.put("investments", investmentDtos);
			result.put("investOverview", overview);

			return result;
		} catch (Exception e) {
			log.error("Error in findInvestmentsWithOverview: {}", e.getMessage(), e);
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
				.totalPage((int)Math.ceil((double)totalCount / pageSize))
				.totalItemCount(totalCount)
				.build())
			.transactions(transactions)
			.build();
	}
}

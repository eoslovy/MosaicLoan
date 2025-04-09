package com.mosaic.investment.repository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
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
import com.mosaic.investment.dto.InvestmentSummaryResponse;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.mosaic.investment.dto.InvestmentListResponse;
import com.mosaic.investment.dto.InvestmentListResponse.InvestmentInfo;
import com.mosaic.investment.dto.ProfitHistoryResponse;
import com.mosaic.investment.dto.ProfitHistoryResponse.ProfitInfo;

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
							totalStatusDistribution.get("transferred") + statusDistribution.get("OWNERSHIP_TRANSFERRED"));
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
				.totalPage((int) Math.ceil((double) totalCount / pageSize))
				.totalItemCount(totalCount)
				.build())
			.transactions(transactions)
			.build();
	}

	@Override
	public InvestmentSummaryResponse getInvestmentSummary(Integer memberId) {
		QInvestment investment = QInvestment.investment;
		
		// 현재 날짜 기준 만기일이 지난 투자만 조회
		LocalDate now = LocalDate.now();
		BooleanExpression dueDateCondition = investment.dueDate.lt(now);
		BooleanExpression memberCondition = investment.accountId.eq(memberId);
		
		// 총 투자 금액 (principal 합계)
		BigDecimal totalInvestmentAmount = queryFactory
			.select(investment.principal.sum())
			.from(investment)
			.where(memberCondition.and(dueDateCondition))
			.fetchOne();
		
		if (totalInvestmentAmount == null) {
			totalInvestmentAmount = BigDecimal.ZERO;
		}
		
		// 투자 건수
		long investmentCount = queryFactory
			.select(investment.count())
			.from(investment)
			.where(memberCondition.and(dueDateCondition))
			.fetchOne();
		
		// 투자별 수익금 (principal * current_rate / 10000) 계산을 위한 모든 투자 데이터 조회
		List<Tuple> investments = queryFactory
			.select(investment.principal, investment.currentRate)
			.from(investment)
			.where(memberCondition.and(dueDateCondition))
			.fetch();
		
		// 누적 수익금 계산
		BigDecimal totalProfitAmount = BigDecimal.ZERO;
		for (Tuple t : investments) {
			BigDecimal principal = t.get(investment.principal);
			Integer currentRate = t.get(investment.currentRate);
			
			if (principal != null && currentRate != null) {
				// 만분율이므로 10000으로 나눔
				BigDecimal profitRate = BigDecimal.valueOf(currentRate)
					.divide(BigDecimal.valueOf(10000), 8, RoundingMode.HALF_UP);
				BigDecimal profit = principal.multiply(profitRate);
				totalProfitAmount = totalProfitAmount.add(profit);
			}
		}
		
		// 평균 수익률 계산 (퍼센트로 표시)
		double averageProfitRate = 0.0;
		if (totalInvestmentAmount.compareTo(BigDecimal.ZERO) > 0) {
			averageProfitRate = totalProfitAmount
				.divide(totalInvestmentAmount, 8, RoundingMode.HALF_UP)
				.multiply(BigDecimal.valueOf(100)) // 100을 곱해 퍼센트로 변환
				.doubleValue();
		}
		
		return InvestmentSummaryResponse.builder()
			.totalInvestmentAmount(totalInvestmentAmount)
			.totalProfitAmount(totalProfitAmount)
			.averageProfitRate(averageProfitRate)
			.investmentCount(investmentCount)
			.build();
	}

	@Override
	public InvestmentListResponse getRecentInvestments(Integer memberId) {
		QInvestment investment = QInvestment.investment;
		
		BooleanExpression memberCondition = investment.accountId.eq(memberId);
		
		// 해당 회원의 투자 목록 조회 (최신순 10개)
		List<Investment> investments = queryFactory
			.selectFrom(investment)
			.where(memberCondition)
			.orderBy(investment.createdAt.desc())
			.limit(10)
			.fetch();
		
		// 투자 정보를 DTO로 변환
		List<InvestmentInfo> investmentInfoList = investments.stream()
			.map(inv -> {
				// 금리 계산 (만분율을 퍼센트로 변환)
				double ratePercent = 0.0;
				if (inv.getTargetRate() != null) {
					ratePercent = inv.getTargetRate() / 100.0; // 만분율을 퍼센트로 변환 (800 -> 8.0)
				}
				
				// 상태 값 한글로 변환
				String statusText = getStatusText(inv.getStatus());
				
				return InvestmentInfo.builder()
					.investmentId(inv.getId())
					.investmentAmount(inv.getPrincipal())
					.rate(ratePercent)
					.dueDate(inv.getDueDate())
					.status(statusText)
					.build();
			})
			.toList();
		
		return InvestmentListResponse.builder()
			.investmentList(investmentInfoList)
			.build();
	}

	// 투자 상태를 한글로 변환하는 메서드
	private String getStatusText(com.mosaic.core.model.status.InvestmentStatus status) {
		if (status == null) {
			return "알 수 없음";
		}
		
		return switch (status) {
			case REQUESTED -> "신청됨";
			case ACTIVE -> "상환중";
			case COMPLETED -> "상환완료";
		};
	}

	@Override
	public ProfitHistoryResponse getProfitHistory(Integer memberId) {
		QInvestment investment = QInvestment.investment;
		
		LocalDate now = LocalDate.now();
		BooleanExpression memberCondition = investment.accountId.eq(memberId);
		BooleanExpression dueDateCondition = investment.dueDate.lt(now);
		
		// 만기일이 지난 투자 조회
		List<Investment> investments = queryFactory
			.selectFrom(investment)
			.where(memberCondition.and(dueDateCondition))
			.orderBy(investment.dueDate.desc())
			.fetch();
		
		List<ProfitInfo> allProfits = new ArrayList<>();
		
		// 각 투자에 대한 수익 정보 생성
		for (Investment inv : investments) {
			if (inv.getCurrentRate() != null && inv.getPrincipal() != null && inv.getDueDate() != null) {
				if (inv.getCurrentRate() < 0) {
					// 수익률이 음수인 경우 일부 상환으로 처리
					allProfits.add(ProfitInfo.builder()
						.title("일부상환")
						.date(inv.getDueDate())
						.amount(inv.getPrincipal().multiply(BigDecimal.valueOf(1 + inv.getCurrentRate() / 10000.0)))
						.build());
				} else {
					// 수익률이 양수인 경우 원금상환과 이자수익으로 분리
					// 1. 원금상환
					allProfits.add(ProfitInfo.builder()
						.title("원금상환")
						.date(inv.getDueDate())
						.amount(inv.getPrincipal())
						.build());
					
					// 2. 이자수익
					BigDecimal interestAmount = inv.getPrincipal()
						.multiply(BigDecimal.valueOf(inv.getCurrentRate() / 10000.0));
					
					allProfits.add(ProfitInfo.builder()
						.title("이자수익")
						.date(inv.getDueDate())
						.amount(interestAmount)
						.build());
				}
			}
		}
		
		// 날짜 기준 내림차순 정렬 후 최대 10개만 선택
		List<ProfitInfo> limitedProfits = allProfits.stream()
			.sorted(Comparator.comparing(ProfitInfo::date).reversed())
			.limit(10)
			.toList();
		
		return ProfitHistoryResponse.builder()
			.profitHistory(limitedProfits)
			.build();
	}
}

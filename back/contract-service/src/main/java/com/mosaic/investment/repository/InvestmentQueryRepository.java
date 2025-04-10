package com.mosaic.investment.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import com.mosaic.core.model.Investment;
import com.mosaic.core.model.Loan;
import com.mosaic.investment.dto.InvestmentListResponse;
import com.mosaic.investment.dto.InvestmentSummaryResponse;
import com.mosaic.investment.dto.InvestmentTransactionResponse;
import com.mosaic.investment.dto.InvestmentTransactionSearchRequest;
import com.mosaic.investment.dto.ProfitHistoryResponse;

public interface InvestmentQueryRepository {

	// 투자 요약 정보 조회 (계약 만기일이 현재 시간보다 앞인 투자만)
	InvestmentSummaryResponse getInvestmentSummary(Integer memberId);

	// 최근 투자 목록 조회 (최신순 10개)
	InvestmentListResponse getRecentInvestments(Integer memberId);

	// 수익 내역 조회 (만기일 지난 투자, 최대 10개)
	ProfitHistoryResponse getProfitHistory(Integer memberId);

	List<Investment> findQualifiedInvestments(BigDecimal minimumAmount, Integer expectYieldRate, Loan loan);

	// 한 번의 쿼리로 투자 목록과 통계 개요 함께 조회
	Map<String, Object> findInvestmentsWithOverview(Integer memberId);

	// 투자 거래 내역을 검색 조건에 따라 조회
	InvestmentTransactionResponse searchTransactions(InvestmentTransactionSearchRequest request, Integer memberId);
}

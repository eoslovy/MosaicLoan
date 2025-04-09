package com.mosaic.investment.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import com.mosaic.core.model.Investment;
import com.mosaic.core.model.Loan;
import com.mosaic.investment.dto.InvestmentTransactionResponse;
import com.mosaic.investment.dto.InvestmentTransactionSearchRequest;

public interface InvestmentQueryRepository {
	List<Investment> findQualifiedInvestments(BigDecimal minimumAmount, Integer expectYieldRate, Loan loan);

	// 한 번의 쿼리로 투자 목록과 통계 개요 함께 조회
	Map<String, Object> findInvestmentsWithOverview(Integer memberId);

	// 투자 거래 내역을 검색 조건에 따라 조회
	InvestmentTransactionResponse searchTransactions(InvestmentTransactionSearchRequest request);
}

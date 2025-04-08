package com.mosaic.investment.repository;

import java.math.BigDecimal;
import java.util.List;

import com.mosaic.core.model.Investment;
import com.mosaic.core.model.Loan;
import com.mosaic.investment.dto.InvestmentTransactionResponse;
import com.mosaic.investment.dto.InvestmentTransactionSearchRequest;
import com.mosaic.investment.dto.InvestmentWithStatusDto;

public interface InvestmentQueryRepository {
    List<Investment> findQualifiedInvestments(BigDecimal minimumAmount, Loan loan);
    
    // 특정 회원의 모든 투자 정보와 각 투자에 연결된 계약들의 상태 분포 조회
    List<InvestmentWithStatusDto> findInvestmentsWithStatusDistribution(Integer memberId);
    
    // 투자 거래 내역을 검색 조건에 따라 조회
    InvestmentTransactionResponse searchTransactions(InvestmentTransactionSearchRequest request);
}

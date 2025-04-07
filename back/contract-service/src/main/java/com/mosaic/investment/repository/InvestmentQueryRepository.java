package com.mosaic.investment.repository;


import com.mosaic.core.model.Investment;
import com.mosaic.core.model.Loan;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface InvestmentQueryRepository {
    List<Investment> findQualifiedInvestments(BigDecimal minimumAmount, Loan loan);
}

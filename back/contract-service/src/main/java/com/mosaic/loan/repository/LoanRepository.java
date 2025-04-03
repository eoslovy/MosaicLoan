package com.mosaic.loan.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mosaic.core.model.Loan;

public interface LoanRepository extends JpaRepository<Loan, Integer> {
}

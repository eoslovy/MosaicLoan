package com.mosaic.loan.repository;

import com.mosaic.core.model.Loan;
import com.mosaic.core.model.status.LoanStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LoanRepository extends JpaRepository<Loan, Integer> {

    Optional<Loan> findById(Integer id);
    @EntityGraph(attributePaths = {"contracts", "contracts.investment"})
    Optional<Loan> findByIdAndStatus(Integer id, LoanStatus status);
}

package com.mosaic.loan.repository;

import com.mosaic.core.model.Loan;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LoanRepository extends JpaRepository<Loan, Integer> {
    @EntityGraph(attributePaths = {"contracts.investments"})
    Optional<Loan> findByIdWithContracts(Integer id);
}

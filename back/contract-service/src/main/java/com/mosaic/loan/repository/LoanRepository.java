package com.mosaic.loan.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.mosaic.core.model.Loan;
import com.mosaic.core.model.status.LoanStatus;

public interface LoanRepository extends JpaRepository<Loan, Integer> {

	Optional<Loan> findById(Integer id);

	@EntityGraph(attributePaths = {"contracts", "contracts.investment"})
	Optional<Loan> findByIdAndStatus(Integer id, LoanStatus status);

	List<Loan> findAllByIdAndDueDate(Integer id, LocalDate dueDate);

	@EntityGraph(attributePaths = {"contracts", "contracts.investment"})
	List<Loan> findAllByDueDateAndStatus(LocalDate dueDate, LoanStatus status);

	@EntityGraph(attributePaths = {"contracts", "contracts.investment"})
	List<Loan> findByStatus(LoanStatus loanStatus);
}

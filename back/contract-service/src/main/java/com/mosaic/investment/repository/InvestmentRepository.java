package com.mosaic.investment.repository;

import java.time.LocalDate;
import java.util.List;

import com.mosaic.core.model.Investment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvestmentRepository extends JpaRepository<Investment, Integer> {

	List<Investment> findAllByDueDate(LocalDate dueDate);
}

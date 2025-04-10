package com.mosaic.investment.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mosaic.core.model.Investment;
import com.mosaic.statistics.repository.RateStatProjection;

@Repository
public interface InvestmentRepository extends JpaRepository<Investment, Integer> {

	List<Investment> findAllByDueDate(LocalDate dueDate);

	@Query(value = """
		SELECT
		    target_rate AS targetRate,
		    FLOOR(current_rate / 100.0 * 10) / 10 AS actualRate,
		    COUNT(*) AS count
		FROM mosaic_contract.investment
		WHERE due_date < CURDATE()
		  AND target_rate BETWEEN 500 AND 1000
		  AND current_rate BETWEEN 500 AND 1000
		GROUP BY 
		    target_rate,
		    FLOOR(current_rate / 100.0 * 10) / 10
		ORDER BY 
		    target_rate, actualRate
		""", nativeQuery = true)
	List<RateStatProjection> findStatistics();
}

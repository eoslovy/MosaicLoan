package com.mosaic.statistics.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mosaic.statistics.model.Statistics;

public interface StatisticsRepository extends JpaRepository<Statistics, Long> {
	List<Statistics> findByTargetRateAndResultDate(Integer targetRate, LocalDate resultDate);

}
package com.mosaic.statistics.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.mosaic.investment.repository.InvestmentRepository;
import com.mosaic.statistics.model.Statistics;
import com.mosaic.statistics.repository.RateStatProjection;
import com.mosaic.statistics.repository.StatisticsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StatisticsService {

	private final InvestmentRepository investmentRepository;
	private final StatisticsRepository statisticsRepository;

	public void calculateAndSaveStatistics() {
		List<RateStatProjection> stats = investmentRepository.findStatistics();
		LocalDate resultDate = LocalDate.now().minusDays(1);

		for (RateStatProjection row : stats) {
			Statistics s = Statistics.builder()
				.targetRate(row.getTargetRate())
				.actualRate(row.getActualRate().multiply(BigDecimal.valueOf(100)).intValue())
				.count(row.getCount())
				.resultDate(resultDate)
				.build();
			statisticsRepository.save(s);
		}
	}
}

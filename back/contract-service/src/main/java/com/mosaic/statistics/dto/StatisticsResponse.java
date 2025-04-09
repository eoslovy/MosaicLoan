package com.mosaic.statistics.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.mosaic.statistics.model.Statistics;

public record StatisticsResponse(
	BigDecimal targetRate,
	LocalDate resultDate,
	List<RateCountDto> distribution
) {
	public static StatisticsResponse from(List<Statistics> stats) {
		if (stats.isEmpty()) return null;

		BigDecimal targetRate = BigDecimal.valueOf(stats.get(0).getTargetRate())
			.divide(BigDecimal.valueOf(100));

		List<RateCountDto> distribution = stats.stream()
			.map(s -> new RateCountDto(
				BigDecimal.valueOf(s.getActualRate()).divide(BigDecimal.valueOf(100)),  // 650 → 6.5
				s.getCount()
			))
			.toList();

		return new StatisticsResponse(targetRate, stats.get(0).getResultDate(), distribution);
	}
}

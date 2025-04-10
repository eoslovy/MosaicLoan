package com.mosaic.statistics.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mosaic.statistics.dto.RateCountDto;
import com.mosaic.statistics.dto.StatisticsResponse;
import com.mosaic.statistics.model.Statistics;
import com.mosaic.statistics.repository.StatisticsRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/statistics")
@RequiredArgsConstructor
public class StatisticsController {

	private final StatisticsRepository statisticsRepository;

	@GetMapping
	public StatisticsResponse getStatisticsByTargetRate(@RequestParam("targetRate") BigDecimal targetRate) {
		BigDecimal storedTarget = targetRate.multiply(BigDecimal.valueOf(100)); // 8.0 → 800
		LocalDate resultDate = LocalDate.now().minusDays(1); // 전날 기준

		List<Statistics> stats = statisticsRepository.findByTargetRateAndResultDate(
			storedTarget.intValue(), resultDate);

		List<RateCountDto> distribution = stats.stream()
			.map(s -> new RateCountDto(BigDecimal.valueOf(s.getActualRate()).divide(BigDecimal.valueOf(100)),
				s.getCount()))
			.toList();

		return new StatisticsResponse(targetRate, resultDate, distribution);
	}
}
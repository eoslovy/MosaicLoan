package com.mosaic.statistics.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.mosaic.statistics.service.StatisticsService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class StatisticsScheduler {

	private final StatisticsService statisticsService;

	@Scheduled(cron = "0 0 1 * * *") // 매일 새벽 1시 실행
	public void scheduleStatisticsJob() {
		statisticsService.calculateAndSaveStatistics();
	}
}

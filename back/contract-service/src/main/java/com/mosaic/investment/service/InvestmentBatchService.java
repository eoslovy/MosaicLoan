package com.mosaic.investment.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class InvestmentBatchService {

	private final InvestmentService investmentService;

	public void runSchedulesAt23(LocalDateTime time, Boolean isBot) {
		// investment 도메인의 일일 처리 로직 등 실행
		log.info("[InvestmentBatch] 실행됨 time: {} isBot: {}", time, isBot);
		try {
			log.info("투자 : Investment 만료로 종료 로직 실행");
			investmentService.executeCompleteInvestmentByDueDate(time, isBot);
		} catch (JsonProcessingException e) {
			log.info("11시에 처리되는 업무가 제대로 처리되지 않았어요");
		}
	}
}
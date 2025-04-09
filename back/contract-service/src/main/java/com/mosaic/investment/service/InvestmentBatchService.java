package com.mosaic.investment.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class InvestmentBatchService {
	public void run(LocalDateTime time, Boolean isBot) {
		// investment 도메인의 일일 처리 로직 등 실행
		log.info("[InvestmentBatch] 실행됨 time: {} isBot: {}", time, isBot);
	}
}
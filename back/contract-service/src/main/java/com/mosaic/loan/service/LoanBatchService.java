package com.mosaic.loan.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class LoanBatchService {
	public void run(LocalDateTime time, Boolean isBot) {
		// loan 도메인의 일일 정산 로직 등 실행
		log.info("[LoanBatch] 실행됨 time: {} isBot: {}", time, isBot);
	}
}

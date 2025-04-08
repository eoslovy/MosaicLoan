package com.mydataservice.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.mydataservice.domain.DataSource;
import com.mydataservice.dto.EvaluationStartRequest;
import com.mydataservice.service.DataService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataConsumer {

	private final DataService dataService;

	@KafkaListener(topics = "EvaluationStart", groupId = "credit-consumer")
	public void listenCredit(EvaluationStartRequest request) {
		log.info("신용 데이터 요청 수신: caseId={}, memberId={}", request.getCaseId(), request.getMemberId());
		dataService.processData(request.getCaseId(), request.getMemberId(), DataSource.CREDIT, request.getCreatedAt());
	}

	@KafkaListener(topics = "EvaluationStart", groupId = "behavior-consumer")
	public void listenBehavior(EvaluationStartRequest request) {
		log.info("행동 데이터 요청 수신: caseId={}, memberId={}", request.getCaseId(), request.getMemberId());
		dataService.processData(request.getCaseId(), request.getMemberId(), DataSource.BEHAVIOR,
			request.getCreatedAt());
	}

	@KafkaListener(topics = "EvaluationStart", groupId = "demographic-consumer")
	public void listenDemographic(EvaluationStartRequest request) {
		log.info("인구통계 데이터 요청 수신: caseId={}, memberId={}", request.getCaseId(), request.getMemberId());
		dataService.processData(request.getCaseId(), request.getMemberId(), DataSource.DEMOGRAPHIC,
			request.getCreatedAt());
	}

	@KafkaListener(topics = "EvaluationStart", groupId = "timeseries-consumer")
	public void listenTimeseries(EvaluationStartRequest request) {
		log.info("시계열 데이터 요청 수신: caseId={}, memberId={}", request.getCaseId(), request.getMemberId());
		dataService.processData(request.getCaseId(), request.getMemberId(), DataSource.TIMESERIES,
			request.getCreatedAt());
	}
} 
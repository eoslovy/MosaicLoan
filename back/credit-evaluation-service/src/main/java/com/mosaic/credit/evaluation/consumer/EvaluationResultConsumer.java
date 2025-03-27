package com.mosaic.credit.evaluation.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.mosaic.credit.evaluation.dto.EvaluationResultDto;
import com.mosaic.credit.evaluation.service.EvaluationAggregatorService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class EvaluationResultConsumer {

	private final EvaluationAggregatorService aggregatorService;

	@KafkaListener(topics = "EvaluationResult", groupId = "evaluation-aggregator")
	public void consume(EvaluationResultDto result) {
		aggregatorService.handleIncomingResult(result);
	}

}


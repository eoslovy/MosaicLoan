package com.mosaic.investment.event.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosaic.investment.event.message.InvestRequestEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class InvestmentKafkaConsumer {
	private static final String INVEST_CREATE_EXECUTE = "invest.created.executed";
	private static final String INVEST_CREATE_REJECT = "invest.create.rejected";
	private final KafkaTemplate<String, String> kafkaTemplate;
	private final ObjectMapper objectMapper = new ObjectMapper();

	@KafkaListener(topics = INVEST_CREATE_EXECUTE)
	public void executeInvestmentRequested(InvestRequestEvent event) throws JsonProcessingException {

	}

	@KafkaListener(topics = INVEST_CREATE_REJECT)
	public void rollbackInvestmentRequested(InvestRequestEvent event) throws JsonProcessingException {

	}
	//TODO 투자 신청한 이미지 메세지를 소비해서 활용

	//TODO
}

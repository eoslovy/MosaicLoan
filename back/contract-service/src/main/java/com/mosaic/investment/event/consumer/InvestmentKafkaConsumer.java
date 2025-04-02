package com.mosaic.investment.event.consumer;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosaic.investment.event.message.LoanCreatedEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class InvestmentKafkaConsumer {
	private static final String INVEST_CREATE = "invest.created";
	private final KafkaTemplate<String, String> kafkaTemplate;
	private final ObjectMapper objectMapper = new ObjectMapper();

	public void handleInvestmentRequested(LoanCreatedEvent event) throws JsonProcessingException {
		kafkaTemplate.send(INVEST_CREATE, event.loanId(), objectMapper.writeValueAsString(event));
	}
	//TODO 투자 신청한 이미지 메세지를 소비해서 활용

	//TODO
}

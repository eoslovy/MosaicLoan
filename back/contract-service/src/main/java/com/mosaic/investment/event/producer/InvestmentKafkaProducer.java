package com.mosaic.investment.event.producer;

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
public class InvestmentKafkaProducer {

	private static final String INVEST_CREATE = "invest.create.request";
	private final KafkaTemplate<String, String> kafkaTemplate;
	private final ObjectMapper objectMapper = new ObjectMapper();

	public void sendLoanCreatedEvent(InvestRequestEvent event) throws JsonProcessingException {
		kafkaTemplate.send(INVEST_CREATE, objectMapper.writeValueAsString(event));
	}
}

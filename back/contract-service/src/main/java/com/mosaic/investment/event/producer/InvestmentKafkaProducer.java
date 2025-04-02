package com.mosaic.investment.event.producer;

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
public class InvestmentKafkaProducer {

	private final KafkaTemplate<String, String> kafkaTemplate;
	private final ObjectMapper objectMapper = new ObjectMapper();

	private static final String TOPIC = "loan.created";

	public void sendLoanCreatedEvent(LoanCreatedEvent event) throws JsonProcessingException {
			kafkaTemplate.send("loan.created", event.loanId(), getString(event));
	}

	private <R> String getString(R event) throws JsonProcessingException {
		String json = objectMapper.writeValueAsString(event);
		return json;
	}
}

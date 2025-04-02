package com.mosaic.loan.event.producer;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosaic.loan.event.message.LoanCreatedEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class LoanKafkaProducer {

	private static final String INVEST_CREATE = "invest.created";
	private final KafkaTemplate<String, String> kafkaTemplate;
	private final ObjectMapper objectMapper = new ObjectMapper();

	public void sendLoanCreatedEvent(LoanCreatedEvent event) throws JsonProcessingException {
		kafkaTemplate.send(INVEST_CREATE, event.loanId(), objectMapper.writeValueAsString(event));
	}
}

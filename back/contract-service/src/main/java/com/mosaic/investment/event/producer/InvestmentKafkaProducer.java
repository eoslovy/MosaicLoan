package com.mosaic.investment.event.producer;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosaic.payload.AccountTransactionPayload;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class InvestmentKafkaProducer {

	private static final String INVEST_REQUESTED = "investment.deposit.requested";
	private static final String INVEST_REJECTED = "investment.deposit.failed";
	private final KafkaTemplate<String, String> kafkaTemplate;
	private final ObjectMapper kafkaObjectMapper;

	public void sendInvestmentCreatedEvent(AccountTransactionPayload payload) throws JsonProcessingException {
		kafkaTemplate.send(INVEST_REQUESTED, kafkaObjectMapper.writeValueAsString(payload));
	}

	public void sendInvestmentRejectedEvent(AccountTransactionPayload payload) throws JsonProcessingException {
		kafkaTemplate.send(INVEST_REJECTED, kafkaObjectMapper.writeValueAsString(payload));
	}
}

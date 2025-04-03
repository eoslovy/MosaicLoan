package com.mosaic.investment.event.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosaic.investment.event.message.AccountTransactionPayload;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class InvestmentKafkaConsumer {
	private static final String INVEST_CREATE_COMPLETE = "investment.deposit.request";
	private static final String INVEST_CREATE_FAIL = "investment.deposit.fail";
	private final KafkaTemplate<String, AccountTransactionPayload> kafkaTemplate;
	private final ObjectMapper objectMapper = new ObjectMapper();

	@KafkaListener(topics = INVEST_CREATE_COMPLETE, groupId = "investment.deposit.complete.consumer")
	public void executeInvestmentRequested(AccountTransactionPayload event) throws JsonProcessingException {
		System.out.println("aslkjvgblkjaegvkjilaweglguvawehfkljawhfklj 처리되었습니다");
		System.out.println(event);
	}

	@KafkaListener(topics = INVEST_CREATE_FAIL, groupId = "investment.deposit.fail.consumer")
	public void rollbackInvestmentRequested(AccountTransactionPayload event) throws JsonProcessingException {

	}
}

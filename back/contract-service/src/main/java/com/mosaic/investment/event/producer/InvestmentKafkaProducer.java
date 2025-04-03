package com.mosaic.investment.event.producer;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.mosaic.investment.event.message.AccountTransactionPayload;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class InvestmentKafkaProducer {

	private static final String INVEST_CREATE = "investment.deposit.request";
	private final KafkaTemplate<String, AccountTransactionPayload> kafkaTemplate;

	public void sendLoanCreatedEvent(AccountTransactionPayload event) {
		kafkaTemplate.send(INVEST_CREATE, event);
	}
}

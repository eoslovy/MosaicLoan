package com.mosaic.accountservice.controller;

import java.math.BigDecimal;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosaic.accountservice.dto.KafkaEnvelope;
import com.mosaic.accountservice.event.model.AccountCreateRequestedPayload;
import com.mosaic.accountservice.event.model.AccountTransactionPayload;
import com.mosaic.accountservice.util.TimestampUtil;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class TestKafkaPublisher {

	private final KafkaTemplate<String, KafkaEnvelope> kafkaTemplate;
	private final ObjectMapper objectMapper;

	public void publishExternalDeposit(int accountId, BigDecimal amount) {
		var payload = new AccountTransactionPayload(accountId, 9999, amount, TimestampUtil.getTimeStamp());
		send("account-transactions", "EXTERNAL_DEPOSIT_COMPLETED", payload);
	}

	public void publishExternalWithdrawal(int accountId, BigDecimal amount) {
		var payload = new AccountTransactionPayload(accountId, 9999, amount, TimestampUtil.getTimeStamp());
		send("account-transactions", "EXTERNAL_WITHDRAWAL_COMPLETED", payload);
	}

	public void publishAccountCreation(int memberId) {
		var payload = new AccountCreateRequestedPayload(memberId, TimestampUtil.getTimeStamp());
		send("account-creation", "ACCOUNT_CREATE_REQUESTED", payload);
	}

	private void send(String topic, String eventType, Object payloadObject) {
		try {
			JsonNode jsonPayload = objectMapper.valueToTree(payloadObject);
			KafkaEnvelope envelope = new KafkaEnvelope(eventType, jsonPayload);
			kafkaTemplate.send(topic, envelope);
		} catch (Exception e) {
			throw new RuntimeException("Failed to send kafka message", e);
		}
	}
}
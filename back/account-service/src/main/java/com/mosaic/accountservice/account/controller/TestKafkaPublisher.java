package com.mosaic.accountservice.account.controller;

import java.math.BigDecimal;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.mosaic.accountservice.account.event.payload.AccountCreateRequestedPayload;
import com.mosaic.accountservice.account.event.payload.AccountTransactionPayload;
import com.mosaic.accountservice.util.TimestampUtil;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class TestKafkaPublisher {

	private final KafkaTemplate<String, Object> kafkaTemplate;

	public void publishExternalDeposit(int accountId, BigDecimal amount) {
		var payload = new AccountTransactionPayload(accountId, 9999, amount, TimestampUtil.getTimeStamp());
		send("external.deposit.requested", payload);
	}

	public void publishExternalWithdrawal(int accountId, BigDecimal amount) {
		var payload = new AccountTransactionPayload(accountId, 9999, amount, TimestampUtil.getTimeStamp());
		send("external.withdrawal.requested", payload);
	}

	public void publishAccountCreation(int memberId) {
		var payload = new AccountCreateRequestedPayload(memberId, TimestampUtil.getTimeStamp());
		send("member.creation", payload);
	}

	private void send(String topic, Object payloadObject) {
		try {
			kafkaTemplate.send(topic, payloadObject);
		} catch (Exception e) {
			throw new RuntimeException("Failed to send kafka message", e);
		}
	}
}
package com.mosaic.accountservice.account.event.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosaic.accountservice.account.event.payload.AccountTransactionPayload;
import com.mosaic.accountservice.account.service.AccountTransactionService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class AccountTransactionConsumer {
	private final AccountTransactionService service;
	private final ObjectMapper objectMapper;

	@KafkaListener(topics = "external.deposit.requested", groupId = "account.external-deposit-requested.consumer")
	public void handleExternalDepositRequest(String message) throws JsonProcessingException {
		AccountTransactionPayload payload = objectMapper.readValue(message, AccountTransactionPayload.class);
		service.handleExternalDeposit(payload);
	}

	@KafkaListener(topics = "external.withdrawal.requested", groupId = "account.external-withdrawal-requested.consumer")
	public void handleExternalWithdrawalRequest(String message) throws JsonProcessingException {
		AccountTransactionPayload payload = objectMapper.readValue(message, AccountTransactionPayload.class);
		service.handleExternalWithdrawal(payload);
	}

}

package com.mosaic.accountservice.event.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosaic.accountservice.dto.KafkaEnvelope;
import com.mosaic.accountservice.event.model.AccountCreateRequestedPayload;
import com.mosaic.accountservice.service.AccountService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class AccountCommandConsumer {
	private final ObjectMapper objectMapper;
	private final AccountService accountService;

	@KafkaListener(topics = "account-creation", groupId = "account-service")
	public void consume(KafkaEnvelope envelope) throws JsonProcessingException {
		AccountCreateRequestedPayload payload = objectMapper.treeToValue(envelope.getPayload(),
			AccountCreateRequestedPayload.class);
		accountService.createAccount(payload.getMemberId());
	}
}
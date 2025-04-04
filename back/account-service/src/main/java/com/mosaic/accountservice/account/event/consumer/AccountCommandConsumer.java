package com.mosaic.accountservice.account.event.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosaic.accountservice.account.service.AccountService;
import com.mosaic.payload.AccountCreateRequestedPayload;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class AccountCommandConsumer {
	private final AccountService accountService;
	private final ObjectMapper objectMapper;

	@KafkaListener(topics = "member.creation", groupId = "account.member-creation.consumer")
	public void handleMemberCreation(String message) throws JsonProcessingException {
		AccountCreateRequestedPayload payload = objectMapper.readValue(message, AccountCreateRequestedPayload.class);
		accountService.createAccount(payload.getMemberId());
	}
}
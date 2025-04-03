package com.mosaic.accountservice.account.event.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.mosaic.accountservice.account.event.payload.AccountCreateRequestedPayload;
import com.mosaic.accountservice.account.service.AccountService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class AccountCommandConsumer {
	private final AccountService accountService;

	@KafkaListener(topics = "member.creation", groupId = "account.member-creation.consumer")
	public void handleMemberCreation(AccountCreateRequestedPayload payload) {
		accountService.createAccount(payload.getMemberId());
	}
}
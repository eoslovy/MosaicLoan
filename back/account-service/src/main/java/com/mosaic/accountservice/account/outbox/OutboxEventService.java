package com.mosaic.accountservice.account.outbox;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosaic.accountservice.account.event.payload.AccountTransactionPayload;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OutboxEventService {
	private final ObjectMapper objectMapper;
	private final OutboxEventRepository outboxEventRepository;

	public void createOutboxEvent(String topic, AccountTransactionPayload payload) throws JsonProcessingException {
		OutboxEvent outboxEvent = OutboxEvent.builder()
			.topic(topic)
			.key(payload.accountId().toString())
			.payload(objectMapper.writeValueAsString(payload))
			.build();
		outboxEventRepository.save(outboxEvent);
	}
}

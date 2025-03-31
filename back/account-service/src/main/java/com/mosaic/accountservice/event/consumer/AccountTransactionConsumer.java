package com.mosaic.accountservice.event.consumer;

import java.util.List;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosaic.accountservice.dto.KafkaEnvelope;
import com.mosaic.accountservice.event.handler.TransactionEventHandler;
import com.mosaic.accountservice.event.model.AccountTransactionPayload;
import com.mosaic.accountservice.event.model.AccountTransactionType;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class AccountTransactionConsumer {

	private final List<TransactionEventHandler> handlers;
	private final ObjectMapper objectMapper;

	@KafkaListener(topics = "account-transactions", groupId = "account-service")
	public void consume(KafkaEnvelope envelope) throws JsonProcessingException {
		AccountTransactionType type = AccountTransactionType.valueOf(envelope.getEventType());

		AccountTransactionPayload payload = objectMapper.treeToValue(envelope.getPayload(),
			AccountTransactionPayload.class);

		handlers.stream()
			.filter(handler -> handler.supports(type))
			.findFirst()
			.ifPresentOrElse(
				handler -> handler.handle(payload),
				() -> log.warn("존재하지 않는 Event: {}", type)
			);
	}
}
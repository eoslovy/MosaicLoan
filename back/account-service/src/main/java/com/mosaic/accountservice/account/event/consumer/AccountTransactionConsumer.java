package com.mosaic.accountservice.account.event.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.mosaic.accountservice.account.domain.TransactionType;
import com.mosaic.accountservice.account.event.payload.AccountTransactionPayload;
import com.mosaic.accountservice.account.outbox.OutboxEvent;
import com.mosaic.accountservice.account.outbox.OutboxEventRepository;
import com.mosaic.accountservice.account.service.AccountTransactionService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class AccountTransactionConsumer {
	private final AccountTransactionService service;
	private final OutboxEventRepository outboxEventRepository;

	@KafkaListener(topics = "external.withdrawal.requested", groupId = "account.external-withdrawal-requested.consumer")
	public void handleExternalWithdrawalRequest(AccountTransactionPayload payload) {
		try {
			service.processTransaction(payload.accountId(), payload.amount(), TransactionType.EXTERNAL_OUT, "외부 출금",
				payload.targetId());
		} catch (Exception ex) {
			OutboxEvent.builder()
				.topic("external.withdrawal.failed")
				.key(payload.accountId().toString())
				.payload(payload.toString())
				.build();
			log.error("외부 출금 트랜잭션 처리 중 오류가 발생했습니다. message: {}", ex.getMessage(), ex);
		}
	}

	@KafkaListener(topics = "external.deposit.requested", groupId = "account.external-deposit-requested.consumer")
	public void handleExternalDepositRequest(AccountTransactionPayload payload) {
		try {
			service.processTransaction(payload.accountId(), payload.amount(), TransactionType.EXTERNAL_IN, "외부 입금",
				payload.targetId());
		} catch (Exception ex) {
			OutboxEvent.builder()
				.topic("external.deposit.failed")
				.key(payload.accountId().toString())
				.payload(payload.toString())
				.build();
			log.error("외부 출금 트랜잭션 처리 중 오류가 발생했습니다. message: {}", ex.getMessage(), ex);
		}
	}
}

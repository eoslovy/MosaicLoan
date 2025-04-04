package com.mosaic.accountservice.account.outbox;

import java.util.List;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class OutboxProcessor {

	private final OutboxEventRepository outboxRepository;
	private final KafkaTemplate<String, String> kafkaTemplate;

	private static final int BATCH_SIZE = 100;

	@Scheduled(fixedDelay = 1000)
	public void publishPendingEvents() {
		List<OutboxEvent> events = outboxRepository.findTop100ByStatusOrderByCreatedAt(EventStatus.PENDING);

		for (OutboxEvent event : events) {
			try {
				kafkaTemplate.send(event.getTopic(), event.getPartitioningKey(), event.getPayload());
				event.markAsSent();
			} catch (Exception e) {
				log.error("[Outbox] Kafka 전송 실패 - topic={}, key={}, error={}",
					event.getTopic(), event.getPartitioningKey(), e.getMessage(), e);
				event.markAsFailed(); // 재시도는 status = FAILED 로 남김
			}
		}

		outboxRepository.batchUpdate(events); // 일괄 저장
	}
}
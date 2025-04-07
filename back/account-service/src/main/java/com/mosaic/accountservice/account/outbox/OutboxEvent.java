package com.mosaic.accountservice.account.outbox;

import java.time.LocalDateTime;

import com.mosaic.accountservice.util.TimestampUtil;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "outbox_event")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OutboxEvent {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	private String topic;
	private String partitioningKey;

	@Lob
	private String payload;
	@Enumerated(EnumType.STRING)
	private EventStatus status;
	private LocalDateTime createdAt;
	private LocalDateTime sentAt;

	@Builder
	public static OutboxEvent create(String topic, String key,
		String payload) {
		OutboxEvent event = new OutboxEvent();
		event.topic = topic;
		event.partitioningKey = key;
		event.payload = payload;
		event.status = EventStatus.PENDING;
		event.createdAt = TimestampUtil.getTimeStamp();
		return event;
	}

	public void markAsSent() {
		this.status = EventStatus.SENT;
		this.sentAt = LocalDateTime.now();
	}

	public void markAsFailed() {
		this.status = EventStatus.FAILED;
	}
}

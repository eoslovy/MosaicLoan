package com.mosaic.accountservice.external.outbox;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ExternalOutboxEventRepository extends JpaRepository<ExternalOutboxEvent, Integer> {
	List<ExternalOutboxEvent> findTop100ByStatusOrderByCreatedAt(EventStatus status);
}

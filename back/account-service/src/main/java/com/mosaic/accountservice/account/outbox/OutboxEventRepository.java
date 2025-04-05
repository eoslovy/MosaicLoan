package com.mosaic.accountservice.account.outbox;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OutboxEventRepository extends JpaRepository<OutboxEvent, Integer>, OutboxEventJdbcRepository {
	List<OutboxEvent> findTop100ByStatusOrderByCreatedAt(EventStatus status);
}

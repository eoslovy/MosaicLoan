package com.mosaic.accountservice.account.outbox;

import java.util.List;

public interface OutboxEventJdbcRepository {
	void batchInsert(List<OutboxEvent> events);
}

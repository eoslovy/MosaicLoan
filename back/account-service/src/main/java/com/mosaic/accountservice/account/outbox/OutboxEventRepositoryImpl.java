package com.mosaic.accountservice.account.outbox;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;

import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class OutboxEventRepositoryImpl {

	private final JdbcTemplate jdbcTemplate;

	public void batchInsert(List<OutboxEvent> events) {
		String sql = """
			INSERT INTO outbox_event
			(topic, partitioning_key, payload, status, created_at)
			VALUES (?, ?, ?, ?, ?)
			""";

		jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement ps, int i) throws SQLException {
				OutboxEvent event = events.get(i);
				ps.setString(1, event.getTopic());
				ps.setString(2, event.getPartitioningKey());
				ps.setString(3, event.getPayload());
				ps.setString(4, event.getStatus().name());
				ps.setTimestamp(5, Timestamp.valueOf(event.getCreatedAt()));
			}

			@Override
			public int getBatchSize() {
				return events.size();
			}
		});
	}
}

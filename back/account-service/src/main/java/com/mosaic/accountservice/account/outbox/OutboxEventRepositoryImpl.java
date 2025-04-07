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

	public void batchUpdate(List<OutboxEvent> events) {
		String sql = "UPDATE outbox_event SET status = ?, sent_at = ? WHERE id = ?";

		jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement ps, int i) throws SQLException {
				OutboxEvent event = events.get(i);
				ps.setString(1, event.getStatus().name());
				ps.setTimestamp(2, Timestamp.valueOf(event.getSentAt()));
				ps.setLong(3, event.getId());
			}

			@Override
			public int getBatchSize() {
				return events.size();
			}
		});
	}
}

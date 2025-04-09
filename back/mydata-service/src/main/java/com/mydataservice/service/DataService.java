package com.mydataservice.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.mydataservice.domain.DataSource;
import com.mydataservice.dto.EvaluationResult;
import com.mydataservice.exception.DataProcessingException;
import com.mydataservice.exception.ErrorCode;
import com.mydataservice.util.TimeUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class DataService {

	private final JdbcTemplate jdbcTemplate;
	private final KafkaTemplate<String, Object> kafkaTemplate;
	private final TimeUtil timeUtil;

	public void processData(String caseId, Integer memberId, DataSource source, LocalDateTime createdAt) {
		try {
			List<Map<String, Object>> results = jdbcTemplate.queryForList(source.getQuery(), caseId);
			EvaluationResult result = results.isEmpty()
				? EvaluationResult.notFound(caseId, memberId, source.getSource(), createdAt)
				: EvaluationResult.found(caseId, memberId, source.getSource(), results.get(0), createdAt);

			CompletableFuture<?> future = kafkaTemplate.send("EvaluationResult", caseId, result);

			future.whenComplete((success, failure) -> {
				if (failure != null) {
					log.error("Failed to publish result for caseId: {} and source: {}",
						caseId, source.getSource(), failure);
					throw new DataProcessingException(ErrorCode.KAFKA_PUBLISH_ERROR);
				}
			});
		} catch (Exception e) {
			log.error("Failed to process caseId: {} for source: {}", caseId, source.getSource(), e);
			throw new DataProcessingException(ErrorCode.PROCESSING_ERROR, e.getMessage());
		}
	}
} 
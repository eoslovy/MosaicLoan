package com.mosaic.credit.data.service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.mosaic.credit.data.domain.DataSource;
import com.mosaic.credit.data.dto.EvaluationResult;
import com.mosaic.credit.data.exception.DataProcessingException;
import com.mosaic.credit.data.exception.ErrorCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class DataService {
    
    private final JdbcTemplate jdbcTemplate;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void processData(String caseId, Integer memberId,DataSource source) {
        try {
            List<Map<String, Object>> results = jdbcTemplate.queryForList(source.getQuery(), caseId);
            EvaluationResult result = results.isEmpty() 
                ? EvaluationResult.notFound(caseId, memberId, source.getSource())
                : EvaluationResult.found(caseId, memberId, source.getSource(), results.get(0));
            
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
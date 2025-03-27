package com.mosaic.credit.evaluation.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosaic.credit.evaluation.dto.EvaluationResultDto;
import com.mosaic.credit.evaluation.exception.EvaluationException;
import com.mosaic.credit.evaluation.exception.ErrorCode;
import com.mosaic.credit.evaluation.repository.redis.RedisKeyGenerator;
import com.mosaic.credit.evaluation.repository.redis.RedisRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EvaluationDataService {
    private final RedisRepository redisRepository;
    private final ObjectMapper objectMapper;

    public boolean isAlreadyReceived(String caseId, String source) {
        String key = RedisKeyGenerator.getReceivedKey(caseId);
        return redisRepository.isMember(key, source);
    }

    public void saveReceivedSource(String caseId, String source) {
        String key = RedisKeyGenerator.getReceivedKey(caseId);
        redisRepository.addToSet(key, source);
        log.debug("저장된 소스: caseId = {}, source = {}", caseId, source);
    }

    public void savePayload(String caseId, String source, EvaluationResultDto result) {
        String key = RedisKeyGenerator.getPayloadKey(caseId, source);
        try {
            String json = objectMapper.writeValueAsString(result);
            redisRepository.set(key, json);
            log.debug("저장된 페이로드: caseId = {}, source = {}", caseId, source);
        } catch (Exception e) {
            log.error("페이로드 저장 실패: caseId = {}, source = {}", caseId, source, e);
            throw new EvaluationException(ErrorCode.PROCESSING_ERROR);
        }
    }

    public void saveTimestampIfAbsent(String caseId) {
        String key = RedisKeyGenerator.getTimestampKey(caseId);
        if (!redisRepository.hasKey(key)) {
            redisRepository.set(key, String.valueOf(System.currentTimeMillis()));
            log.debug("저장된 타임스탬프: caseId = {}", caseId);
        }
    }

    public int getReceivedCount(String caseId) {
        String key = RedisKeyGenerator.getReceivedKey(caseId);
        Long size = redisRepository.getSetSize(key);
        return size != null ? size.intValue() : 0;
    }

    public Map<String, Object> collectAllPayloads(String caseId, List<String> sources) {
        Map<String, Object> mergedPayload = new HashMap<>();
        for (String source : sources) {
            Optional<EvaluationResultDto> result = getPayload(caseId, source);
            if (result.isPresent()) {
                mergedPayload.put(source, result.get().getPayload());
            }
        }
        return mergedPayload;
    }

    public Optional<EvaluationResultDto> getPayload(String caseId, String source) {
        String key = RedisKeyGenerator.getPayloadKey(caseId, source);
        String json = redisRepository.get(key);
        if (json == null) {
            return Optional.empty();
        }
        try {
            EvaluationResultDto result = objectMapper.readValue(json, EvaluationResultDto.class);
            return Optional.of(result);
        } catch (Exception e) {
            log.error("페이로드 조회 실패: caseId = {}, source = {}", caseId, source, e);
            throw new EvaluationException(ErrorCode.PROCESSING_ERROR);
        }
    }

    public void cleanup(String caseId, List<String> sources) {
        // 페이로드 키 삭제
        for (String source : sources) {
            String payloadKey = RedisKeyGenerator.getPayloadKey(caseId, source);
            redisRepository.delete(payloadKey);
        }
        
        // 수신 소스 및 타임스탬프 키 삭제
        redisRepository.delete(RedisKeyGenerator.getReceivedKey(caseId));
        redisRepository.delete(RedisKeyGenerator.getTimestampKey(caseId));
        
        log.info("Redis 데이터 삭제 완료: caseId = {}", caseId);
    }
} 
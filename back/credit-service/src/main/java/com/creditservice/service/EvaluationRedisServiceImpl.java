package com.creditservice.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.creditservice.dto.EvaluationResultDto;
import com.creditservice.exception.ErrorCode;
import com.creditservice.exception.RedisException;
import com.creditservice.repository.redis.RedisKeyGenerator;
import com.creditservice.repository.redis.RedisRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EvaluationRedisServiceImpl implements EvaluationRedisService {
	private final RedisRepository redisRepository;
	private final ObjectMapper objectMapper;

	public boolean isAlreadyReceived(String caseId, String source) {
		try {
			String key = RedisKeyGenerator.getReceivedKey(caseId);
			return redisRepository.isMember(key, source);
		} catch (Exception e) {
			throw new RedisException(ErrorCode.REDIS_READ_ERROR,
				"수신 여부 확인 실패: caseId = " + caseId + ", source = " + source);
		}
	}

	public void saveReceivedSource(String caseId, String source) {
		try {
			String key = RedisKeyGenerator.getReceivedKey(caseId);
			redisRepository.addToSet(key, source);
		} catch (Exception e) {
			throw new RedisException(ErrorCode.REDIS_SAVE_ERROR,
				"수신 소스 저장 실패: caseId = " + caseId + ", source = " + source);
		}
	}

	public void savePayload(String caseId, String source, EvaluationResultDto result) {
		try {
			String key = RedisKeyGenerator.getPayloadKey(caseId, source);
			String json = objectMapper.writeValueAsString(result);
			redisRepository.set(key, json);
		} catch (Exception e) {
			throw new RedisException(ErrorCode.REDIS_SAVE_ERROR,
				"페이로드 저장 실패: caseId = " + caseId + ", source = " + source);
		}
	}

	public void saveTimestampIfAbsent(String caseId) {
		try {
			String key = RedisKeyGenerator.getTimestampKey(caseId);
			if (!redisRepository.hasKey(key)) {
				redisRepository.set(key, String.valueOf(System.currentTimeMillis()));
			}
		} catch (Exception e) {
			throw new RedisException(ErrorCode.REDIS_SAVE_ERROR, "타임스탬프 저장 실패: caseId = " + caseId);
		}
	}

	public int getReceivedCount(String caseId) {
		try {
			String key = RedisKeyGenerator.getReceivedKey(caseId);
			Long size = redisRepository.getSetSize(key);
			return size != null ? size.intValue() : 0;
		} catch (Exception e) {
			throw new RedisException(ErrorCode.REDIS_READ_ERROR, "수신 카운트 조회 실패: caseId = " + caseId);
		}
	}

	public Map<String, Object> collectAllPayloads(String caseId, List<String> sources) {
		try {
			Map<String, Object> mergedPayload = new HashMap<>();
			for (String source : sources) {
				EvaluationResultDto result = getPayload(caseId, source);
				mergedPayload.put(source, result.getPayload());
			}
			return mergedPayload;
		} catch (Exception e) {
			throw new RedisException(ErrorCode.REDIS_READ_ERROR, "전체 페이로드 조회 실패: caseId = " + caseId);
		}
	}

	public EvaluationResultDto getPayload(String caseId, String source) {
		try {
			String key = RedisKeyGenerator.getPayloadKey(caseId, source);
			String json = redisRepository.get(key);
			return objectMapper.readValue(json, EvaluationResultDto.class);
		} catch (Exception e) {
			throw new RedisException(ErrorCode.REDIS_READ_ERROR,
				"페이로드 조회 실패: caseId = " + caseId + ", source = " + source);
		}
	}

	public void cleanup(String caseId, List<String> sources) {
		try {
			// 페이로드 키 삭제
			for (String source : sources) {
				String payloadKey = RedisKeyGenerator.getPayloadKey(caseId, source);
				redisRepository.delete(payloadKey);
			}

			// 수신 소스 및 타임스탬프 키 삭제
			redisRepository.delete(RedisKeyGenerator.getReceivedKey(caseId));
			redisRepository.delete(RedisKeyGenerator.getTimestampKey(caseId));
		} catch (Exception e) {
			throw new RedisException(ErrorCode.REDIS_DELETE_ERROR, "Redis 데이터 삭제 실패: caseId = " + caseId);
		}
	}
} 
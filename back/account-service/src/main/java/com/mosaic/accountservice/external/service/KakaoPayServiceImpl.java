package com.mosaic.accountservice.external.service;

import java.math.BigDecimal;
import java.time.Duration;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosaic.accountservice.external.client.KakaoPayClient;
import com.mosaic.accountservice.external.dto.KakaoPayReadyJsonResponse;
import com.mosaic.accountservice.external.dto.KakaoPayReadyResponse;
import com.mosaic.accountservice.external.model.ExternalDepositTransaction;
import com.mosaic.accountservice.external.outbox.ExternalOutboxEvent;
import com.mosaic.accountservice.external.outbox.ExternalOutboxEventRepository;
import com.mosaic.accountservice.external.repository.ExternalDepositTransactionRepository;
import com.mosaic.accountservice.util.TimestampUtil;
import com.mosaic.payload.AccountTransactionPayload;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class KakaoPayServiceImpl implements KakaoPayService {

	private final StringRedisTemplate redisTemplate;
	private final KakaoPayClient kakaoPayClient;
	private final ExternalDepositTransactionRepository externalDepositTransactionRepository;
	private final ExternalOutboxEventRepository externalOutboxEventRepository;
	private final ObjectMapper objectMapper;

	@Override
	public KakaoPayReadyResponse getReady(Integer amount, Integer memberId) {
		// 임시 orderId 정책 논의 필요
		String orderId = memberId.toString() + "-" + TimestampUtil.getTimeStamp();

		KakaoPayReadyJsonResponse response = kakaoPayClient.requestReady(memberId, orderId, amount);
		String redisKey = "kakaopay:tid:" + memberId;
		redisTemplate.opsForHash().put(redisKey, "tid", response.tid());
		redisTemplate.opsForHash().put(redisKey, "orderId", orderId);
		redisTemplate.expire(redisKey, Duration.ofMinutes(10));

		return new KakaoPayReadyResponse(response.next_redirect_pc_url());
	}

	@Override
	@Transactional
	public void approveKakaoPay(String pgToken, Integer memberId) throws JsonProcessingException {
		String redisKey = "kakaopay:tid:" + memberId;

		String tid = (String)redisTemplate.opsForHash().get(redisKey, "tid");
		String orderId = (String)redisTemplate.opsForHash().get(redisKey, "orderId");

		if (tid == null || orderId == null) {
			log.error("tid: {} orderId: {}", tid, orderId);
			throw new IllegalStateException("결제 정보가 유실되었습니다");
		}

		var response = kakaoPayClient.requestApprove(memberId, orderId, pgToken, tid);

		var externalDepositTransaction = ExternalDepositTransaction.builder()
			.accountId(memberId)
			.amount(new BigDecimal(response.amount().total()))
			.externalTransactionId(tid)
			.approvedAt(response.approved_at())
			.build();

		var tx = externalDepositTransactionRepository.save(externalDepositTransaction);

		var payload = new AccountTransactionPayload(
			tx.getAccountId(),
			tx.getId(),
			tx.getAmount(),
			tx.getCreatedAt()
		);

		ExternalOutboxEvent event = ExternalOutboxEvent.builder()
			.topic("external.deposit.requested")
			.key(tx.getId().toString())
			.payload(objectMapper.writeValueAsString(payload))
			.build();

		externalOutboxEventRepository.save(event);
	}
}

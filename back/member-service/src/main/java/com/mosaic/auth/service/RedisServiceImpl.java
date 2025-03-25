package com.mosaic.auth.service;

import java.time.Duration;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RedisServiceImpl implements RedisService {

	private final StringRedisTemplate redisTemplate;
	private static final String ACCESS_TOKEN_PREFIX = "access:";
	private static final String BLACKLIST_PREFIX = "blacklist:";

	@Override
	public void saveAccessToken(Integer memberId, String accessToken, long validityMillis) {
		redisTemplate.opsForValue().set(
			ACCESS_TOKEN_PREFIX + memberId,
			accessToken,
			Duration.ofMillis(validityMillis)
		);
	}

	@Override
	public String getAccessToken(Integer memberId) {
		return redisTemplate.opsForValue().get(ACCESS_TOKEN_PREFIX + memberId);
	}

	@Override
	public void deleteAccessToken(Integer memberId) {
		redisTemplate.delete(ACCESS_TOKEN_PREFIX + memberId);
	}

	@Override
	public void addToBlacklist(String token, long expirationMillis) {
		if (expirationMillis <= 0) {
			return;
		}
		redisTemplate.opsForValue().set(
			BLACKLIST_PREFIX + token,
			"logout",
			Duration.ofMillis(expirationMillis)
		);
	}

	@Override
	public boolean isBlacklisted(String token) {
		return Boolean.TRUE.equals(redisTemplate.hasKey(BLACKLIST_PREFIX + token));
	}
} 
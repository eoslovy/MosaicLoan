package com.creditservice.util;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class TimeUtil {

	private static final ZoneId ZONE_ID = ZoneId.of("Asia/Seoul");
	private static final String BOT_TIMESTAMP_KEY = "bot:timestamp";
	private static final String LOCK_KEY = "bot:lock";
	private static final LocalDateTime DEFAULT_BOT_START = LocalDateTime.of(2022, 1, 1, 0, 0);

	private final StringRedisTemplate redisTemplate;

	public LocalDateTime now(boolean isBot) {
		if (!isBot) {
			return LocalDateTime.now(ZONE_ID);
		}

		if (isLocked()) {
			throw new IllegalStateException("봇 타임스탬프는 현재 트리거 작업 중입니다.");
		}

		return getBotTimestamp();
	}

	private boolean isLocked() {
		return Boolean.TRUE.equals(redisTemplate.hasKey(LOCK_KEY));
	}

	private LocalDateTime getBotTimestamp() {
		long increment = ThreadLocalRandom.current().nextLong(30_000, 180_000);
		Long updated = redisTemplate.opsForValue().increment(BOT_TIMESTAMP_KEY, increment);

		if (updated == null || updated == 1L) {
			long initial = DEFAULT_BOT_START.atZone(ZONE_ID).toInstant().toEpochMilli();
			redisTemplate.opsForValue().set(BOT_TIMESTAMP_KEY, String.valueOf(initial));
			updated = initial;
		}

		return LocalDateTime.ofInstant(Instant.ofEpochMilli(updated), ZONE_ID);
	}

	public static LocalDate dueDate(LocalDate baseDate, int weeks) {
		return baseDate.plusWeeks(weeks);
	}

	public static LocalDate dueDate(LocalDateTime baseTime, int weeks) {
		return baseTime.toLocalDate().plusWeeks(weeks);
	}
}

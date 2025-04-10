package com.mosaic.core.util;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.context.annotation.Lazy;
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
	@Lazy
	private final BotTimeTriggerManager botTimeTriggerManager;

	public LocalDateTime now(boolean isBot) {
		if (!isBot) {
			return LocalDateTime.now(ZONE_ID);
		}

		if (isLocked()) {
			throw new IllegalStateException("봇 타임스탬프는 현재 트리거 작업 중입니다.");
		}

		LocalDateTime botTime = getBotTimestamp();
		botTimeTriggerManager.triggerIfNeeded(botTime);
		return botTime;
	}

	private boolean isLocked() {
		return Boolean.TRUE.equals(redisTemplate.hasKey(LOCK_KEY));
	}

	private LocalDateTime getBotTimestamp() {
		String key = BOT_TIMESTAMP_KEY;
		long increment = ThreadLocalRandom.current().nextLong(30_000, 180_000);

		// 키가 없을 경우 초기값 설정
		if (Boolean.FALSE.equals(redisTemplate.hasKey(key))) {
			long initial = DEFAULT_BOT_START.atZone(ZONE_ID).toInstant().toEpochMilli();
			redisTemplate.opsForValue().set(key, String.valueOf(initial));
		}

		Long updated = redisTemplate.opsForValue().increment(key, increment);

		if (updated == null) {
			throw new IllegalStateException("Redis에서 bot timestamp 증가에 실패했습니다.");
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


package com.mosaic.core.util;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import com.mosaic.core.exception.BotTimestampLockedException;
import com.mosaic.investment.service.InvestmentBatchService;
import com.mosaic.loan.service.LoanBatchService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class BotTimeTriggerManager {

	private static final String LOCK_KEY = "bot:lock";

	private final StringRedisTemplate redisTemplate;
	private final LoanBatchService loanBatchService;
	private final InvestmentBatchService investmentBatchService;

	public void triggerIfNeeded(LocalDateTime botTime) {
		LocalDate date = botTime.toLocalDate();

		if (isLocked()) {
			throw new BotTimestampLockedException("트리거 작업 중입니다.");
		}
		if (botTime.getHour() >= 22 && !hasTriggered(loanKey(date))) {
			runWithLock(() -> {
				loanBatchService.runSchedulesAt21(botTime, Boolean.TRUE);
				markTriggered(loanKey(date));
			});
		}
		if (botTime.getHour() >= 22 && !hasTriggered(loanKey(date))) {
			runWithLock(() -> {
				loanBatchService.runSchedulesAt21(botTime, Boolean.TRUE);
				markTriggered(loanKey(date));
			});
		}

		if (botTime.getHour() >= 23 && !hasTriggered(investmentKey(date))) {
			runWithLock(() -> {
				investmentBatchService.runSchedulesAt23(botTime, Boolean.TRUE);
				markTriggered(investmentKey(date));
			});
		}
	}

	private void runWithLock(Runnable action) {
		try {
			redisTemplate.opsForValue().set(LOCK_KEY, "LOCKED", Duration.ofMinutes(30));
			action.run();
		} finally {
			redisTemplate.delete(LOCK_KEY);
		}
	}

	private boolean isLocked() {
		return Boolean.TRUE.equals(redisTemplate.hasKey(LOCK_KEY));
	}

	private boolean hasTriggered(String key) {
		return Boolean.TRUE.equals(redisTemplate.hasKey(key));
	}

	private void markTriggered(String key) {
		redisTemplate.opsForValue().set(key, "done");
	}

	private String loanKey(LocalDate date) {
		return "bot:trigger:loan:" + date;
	}

	private String investmentKey(LocalDate date) {
		return "bot:trigger:investment:" + date;
	}
}
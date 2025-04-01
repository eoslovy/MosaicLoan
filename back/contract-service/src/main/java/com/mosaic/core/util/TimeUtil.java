package com.mosaic.core.util;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;

public class TimeUtil {

	public static LocalDate nowKst() {
		return LocalDate.now(ZoneId.of("Asia/Seoul"));
	}

	public static LocalDateTime dueDate(Instant instant, int months) {
		return instant.atZone(ZoneId.of("Asia/Seoul"))
			.plusMonths(months)
			.toLocalDateTime();
	}
}

package com.mosaic.core.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;

public class TimeUtil {
	public static LocalDateTime now() {
		return LocalDateTime.now().atZone(ZoneId.of("Asia/Seoul")).toLocalDateTime();
	}

	public static LocalDate nowDate() {
		return LocalDate.now(ZoneId.of("Asia/Seoul"));
	}

	public static LocalDate dueDate(LocalDate localDate, int months) {
		return localDate.plusMonths(months);
	}
}

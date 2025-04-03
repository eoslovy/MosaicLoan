package com.mosaic.core.util;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;

public class TimeUtil {
    public static Instant now() {
        return Instant.now();
    }

    public static LocalDate nowDate() {
        return LocalDate.now(ZoneId.of("Asia/Seoul"));
    }

    public static LocalDate dueDate(LocalDate instant, int months) {
        return instant.plusMonths(months);
    }
}

package com.mosaic.accountservice.util;

import java.time.LocalDateTime;
import java.time.ZoneId;

public class TimestampUtil {
	public static LocalDateTime getTimeStamp() {
		return LocalDateTime.now(ZoneId.of("Asia/Seoul"));
	}
}

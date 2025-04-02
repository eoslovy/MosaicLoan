package com.mosaic.core.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ErrorResponse {
	private final LocalDateTime timestamp;
	private final int status;
	private final String error;     // ex: "Bad Request"
	private final String message;   // 상세 메시지
	private final String path;      // 요청 경로
	private final String code;      // 시스템 내 정의한 에러 코드

	public static ErrorResponse of(HttpStatus status, String message, String path, String code) {
		return ErrorResponse.builder()
			.timestamp(LocalDateTime.now())
			.status(status.value())
			.error(status.getReasonPhrase())
			.message(message)
			.path(path)
			.code(code)
			.build();
	}

	public static ErrorResponse of(HttpStatus status, String message, String path) {
		return of(status, message, path, null);
	}
}
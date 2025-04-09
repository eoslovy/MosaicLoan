package com.mydataservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.mydataservice.dto.ErrorResponse;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

	@ExceptionHandler(DataProcessingException.class)
	public ResponseEntity<ErrorResponse> handleDataProcessingException(
		DataProcessingException e, HttpServletRequest request) {
		log.error("DataProcessingException: {}", e.getMessage());
		return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e.getErrorCode(), request);
	}

	@ExceptionHandler(BotTimestampLockedException.class)
	public ResponseEntity<ErrorResponse> handleBotTimestampLockedException(
		BotTimestampLockedException exception, HttpServletRequest request) {
		return createErrorResponse(HttpStatus.SERVICE_UNAVAILABLE, exception.getMessage(), ErrorCode.BOT_TIMESTAMP,
			request);
	}

	private ResponseEntity<ErrorResponse> createErrorResponse(
		HttpStatus status, String message, ErrorCode errorCode, HttpServletRequest request) {
		ErrorResponse errorResponse = ErrorResponse.builder()
			.code(errorCode)
			.message(message)
			.build();

		return ResponseEntity.status(status).body(errorResponse);
	}
} 
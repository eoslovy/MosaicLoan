package com.creditservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.creditservice.dto.ErrorResponse;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

	@ExceptionHandler(EvaluationException.class)
	public ResponseEntity<ErrorResponse> handleEvaluationException(
		EvaluationException e, HttpServletRequest request) {
		log.error("EvaluationException: {}", e.getMessage());
		return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e.getErrorCode(), request);
	}

	@ExceptionHandler(ModelingException.class)
	public ResponseEntity<ErrorResponse> handleModelingException(
		ModelingException e, HttpServletRequest request) {
		log.error("ModelingException: {}", e.getMessage());
		return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e.getErrorCode(), request);
	}

	@ExceptionHandler(WebSocketException.class)
	public ResponseEntity<ErrorResponse> handleWebSocketException(
		WebSocketException e, HttpServletRequest request) {
		log.error("WebSocketException: {}", e.getMessage());
		return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e.getErrorCode(), request);
	}

	@ExceptionHandler(RedisException.class)
	public ResponseEntity<ErrorResponse> handleRedisException(
		RedisException e, HttpServletRequest request) {
		log.error("RedisException: {}", e.getMessage());
		return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e.getErrorCode(), request);
	}

	@ExceptionHandler(KafkaException.class)
	public ResponseEntity<ErrorResponse> handleKafkaException(
		KafkaException e, HttpServletRequest request) {
		log.error("KafkaException: {}", e.getMessage());
		return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e.getErrorCode(), request);
	}

	@ExceptionHandler(IllegalStateException.class)
	public ResponseEntity<ErrorResponse> handleIllegalStateException(
		IllegalStateException e, HttpServletRequest request) {
		log.error("IllegalStateException: {}", e.getMessage());
		return createErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage(), ErrorCode.INVALID_DATA, request);
	}

	@ExceptionHandler(EvaluationNotFoundException.class)
	public ResponseEntity<ErrorResponse> handleEvaluationNotFoundException(
		EvaluationNotFoundException e, HttpServletRequest request) {
		log.error("EvaluationNotFoundException: {}", e.getMessage());
		return createErrorResponse(HttpStatus.NOT_FOUND, e.getMessage(), e.getErrorCode(), request);
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
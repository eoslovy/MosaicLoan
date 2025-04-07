package com.mosaic.auth.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.mosaic.auth.dto.ErrorResponse;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

	@ExceptionHandler(UnauthorizedException.class)
	public ResponseEntity<ErrorResponse> handleUnauthorizedException(UnauthorizedException e,
		HttpServletRequest request) {
		log.error("UnauthorizedException: {}", e.getMessage());
		return createErrorResponse(HttpStatus.UNAUTHORIZED, e.getMessage(), e.getErrorCode(), request);
	}

	@ExceptionHandler(InvalidTokenException.class)
	public ResponseEntity<ErrorResponse> handleInvalidTokenException(
		InvalidTokenException e, HttpServletRequest request) {
		log.error("InvalidTokenException: {}", e.getMessage());
		return createErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage(), e.getErrorCode(), request);
	}

	@ExceptionHandler(TokenNotFoundException.class)
	public ResponseEntity<ErrorResponse> handleTokenNotFoundException(
		TokenNotFoundException e, HttpServletRequest request) {
		log.debug("TokenNotFoundException: {}", e.getMessage());
		return createErrorResponse(HttpStatus.UNAUTHORIZED, e.getMessage(), e.getErrorCode(), request);
	}

	@ExceptionHandler(CookieNotFoundException.class)
	public ResponseEntity<ErrorResponse> handleCookieNotFoundException(
		CookieNotFoundException e, HttpServletRequest request) {
		log.error("CookieNotFoundException: {}", e.getMessage());
		return createErrorResponse(HttpStatus.UNAUTHORIZED, e.getMessage(), e.getErrorCode(), request);
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
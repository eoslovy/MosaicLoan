package com.mosaic.accountservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.accountservice.util.TimestampUtil;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(JsonProcessingException.class)
	public ResponseEntity<ErrorResponse> handleJsonProcessingException(JsonProcessingException ex) {
		return buildResponse(HttpStatus.BAD_REQUEST, ex.getOriginalMessage());
	}

	@ExceptionHandler(IllegalStateException.class)
	public ResponseEntity<ErrorResponse> handleIllegalStateException(IllegalStateException ex) {
		return buildResponse(HttpStatus.CONFLICT, ex.getMessage());
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
		return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
	}

	private ResponseEntity<ErrorResponse> buildResponse(HttpStatus status, String message) {
		ErrorResponse response = ErrorResponse.builder()
			.timestamp(TimestampUtil.getTimeStamp())
			.message(message)
			.build();
		return ResponseEntity.status(status).body(response);
	}
}
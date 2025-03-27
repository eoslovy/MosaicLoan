package com.mosaic.credit.evaluation.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.mosaic.credit.evaluation.dto.ErrorResponse;

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

    private ResponseEntity<ErrorResponse> createErrorResponse(
            HttpStatus status, String message, ErrorCode errorCode, HttpServletRequest request) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .code(errorCode)
                .message(message)
                .build();

        return ResponseEntity.status(status).body(errorResponse);
    }
} 
package com.mosaic.core.handler;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.mosaic.core.exception.ErrorResponse;
import com.mosaic.core.exception.InternalApiException;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
	//TODO 에러 메세지 정확히 처리
	@ExceptionHandler(InternalApiException.class)
	public ResponseEntity<ErrorResponse> handleInternalApiException(
		InternalApiException e,
		HttpServletRequest request
	) {
		log.warn("[API 호출 실패] target={}, status={}, message={}",
			e.getTargetService(), e.getStatus(), e.getMessage(), e);

		return ResponseEntity.status(e.getStatus())
			.body(ErrorResponse.of(
				e.getStatus(),
				e.getMessage(),
				"내부 경로 -> 외부에 노출할 경로",
				"오류가 발생했습니다"
			));
	}
}

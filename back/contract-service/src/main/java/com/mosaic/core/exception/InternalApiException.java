package com.mosaic.core.exception;

import org.springframework.http.HttpStatus;

public class InternalApiException extends RuntimeException {
	private final HttpStatus status;
	private final String targetService;
	private final String responseBody;

	public InternalApiException(HttpStatus status, String targetService, String responseBody, Throwable cause) {
		super("[" + targetService + "] 요청 실패 - status: " + status + ", body: " + responseBody, cause);
		this.status = status;
		this.targetService = targetService;
		this.responseBody = responseBody;
	}

	public HttpStatus getStatus() {
		return status;
	}

	public String getTargetService() {
		return targetService;
	}

	public String getResponseBody() {
		return responseBody;
	}
}
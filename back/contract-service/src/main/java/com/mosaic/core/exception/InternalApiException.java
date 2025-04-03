package com.mosaic.core.exception;

import org.springframework.http.HttpStatusCode;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import lombok.Getter;

@Getter
public class InternalApiException extends RuntimeException {
	private final HttpStatusCode status;
	private final String targetService;
	private final String responseBody;

	public InternalApiException(HttpStatusCode status, String targetService, String responseBody, Throwable cause) {
		super("[" + targetService + "] 요청 실패 - status: " + status + ", body: " + responseBody, cause);
		this.status = status;
		this.targetService = targetService;
		this.responseBody = responseBody;
	}

	public InternalApiException(WebClientResponseException e, String targetService) {
		super("[" + targetService + "] 요청 실패 - status: " + e.getStatusCode() + ", body: " + e.getResponseBodyAsString(),
			e);
		this.status = e.getStatusCode();
		this.targetService = targetService;
		this.responseBody = e.getResponseBodyAsString();
	}
}
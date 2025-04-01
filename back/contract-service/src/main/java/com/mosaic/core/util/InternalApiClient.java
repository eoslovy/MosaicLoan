package com.mosaic.core.util;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InternalApiClient {

	private final WebClient webClient = WebClient.builder()
		.baseUrl("http://springcloud-gateway:8080") // 내부 서비스 주소
		.defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
		.build();
	/*
	public InvestmentResponse sendInvestmentRequest(InvestmentRequest request) {
		return webClient.post()
			.uri("/api/investments")
			.bodyValue(request)
			.retrieve()
			.bodyToMono(InvestmentResponse.class)
			.block(); // 필요 시 비동기 처리 가능 (flatMap 등)
	}

	 */
}
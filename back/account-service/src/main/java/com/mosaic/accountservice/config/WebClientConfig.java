package com.mosaic.accountservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Configuration
@Slf4j
public class WebClientConfig {

	@Bean
	public WebClient kakaoPayWebClient(@Value("${KAKAO_PAY_SECRET_KEY}") String secretKey) {

		return WebClient.builder()
			.baseUrl("https://open-api.kakaopay.com/online")
			.defaultHeader(HttpHeaders.AUTHORIZATION, "SECRET_KEY " + secretKey)
			.defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
			.filter(logRequest())
			.build();
	}

	private ExchangeFilterFunction logRequest() {
		return ExchangeFilterFunction.ofRequestProcessor(clientRequest -> {
			log.info("Request: {} {}", clientRequest.method(), clientRequest.url());
			clientRequest.headers().forEach((name, values) -> values.forEach(
				value -> log.info("Header: {}={}", name, value)
			));
			return Mono.just(clientRequest);
		});
	}
}
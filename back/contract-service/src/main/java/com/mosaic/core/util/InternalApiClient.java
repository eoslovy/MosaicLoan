package com.mosaic.core.util;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.mosaic.investment.dto.GetAccountResponseDto;
import com.mosaic.investment.dto.StartInvestRequestDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InternalApiClient {

	public WebClient getWebClient(InternalApiTarget target) {
		return WebClient.builder()
			.baseUrl(target.getBaseUrl())
			.defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
			.build();
	}

	public <Req, Res> Res sendInvestmentRequest(Req request, InternalApiTarget serviceDNS, String uri, Class<Res> responseType) {
		return getWebClient(serviceDNS)
			.post()
			.uri(uri)
			.bodyValue(request)
			.retrieve()
			.bodyToMono(responseType)
			.block();
	}

}
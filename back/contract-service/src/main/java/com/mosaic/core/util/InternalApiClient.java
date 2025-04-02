package com.mosaic.core.util;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.mosaic.core.exception.InternalApiException;
import com.mosaic.core.exception.InternalSystemException;
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

	public <Req, Res> Res sendInvestmentRequest(Req request, InternalApiTarget serviceDNS, InternalApiTarget internalApiUri, Class<Res> responseType) throws
		InternalSystemException {
		try {
			return getWebClient(serviceDNS)
				.method(HttpMethod.valueOf(serviceDNS.getBaseUrl()))
				.uri(String.valueOf(internalApiUri.getUriEnum()))
				.bodyValue(request)
				.retrieve()
				.bodyToMono(responseType)
				.block();
		} catch (WebClientResponseException e) {
			throw new InternalApiException( e, "서버문제로 계좌 조회 실패"); // 도메인화된 예외
		} catch (Exception e) {
			throw new InternalSystemException("기타에러 발생", e);
		}
	}
}
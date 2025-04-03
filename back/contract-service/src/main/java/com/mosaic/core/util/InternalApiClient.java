package com.mosaic.core.util;

import com.mosaic.core.exception.InternalApiException;
import com.mosaic.core.exception.InternalSystemException;
import com.mosaic.loan.dto.CreditEvaluationResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Service
@RequiredArgsConstructor
public class InternalApiClient {

    public WebClient getWebClient(InternalApiTarget target) {
        return WebClient.builder()
                .baseUrl(target.getBaseUrl())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    public CreditEvaluationResponseDto getMemberDetail(Long memberId) {
        return getWebClient(InternalApiTarget.MEMBER)
                .get()
                .uri("/{id}/latest", memberId)
                .retrieve()
                .bodyToMono(CreditEvaluationResponseDto.class)
                .block();
    }
}
package com.mosaic.core.util;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.mosaic.loan.dto.CreateLoanRequestDto;
import com.mosaic.loan.dto.CreditEvaluationResponseDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InternalApiClient {

	public WebClient getWebClient() {
		return WebClient.create();
	}

	public CreditEvaluationResponseDto getMemberCreditEvaluation(CreateLoanRequestDto creditLoanRequestDto) {
		return getWebClient()
			.get()
			.uri("http://credit-service:8080/evaluations/recent")
			.header("X-MEMBER-ID", String.valueOf(creditLoanRequestDto.id()))
			.retrieve()
			.bodyToMono(CreditEvaluationResponseDto.class)
			.block();
	}
}
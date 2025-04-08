package com.mosaic.accountservice.external.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.accountservice.external.dto.CreatePaymentRequest;
import com.mosaic.accountservice.external.dto.KakaoPayReadyResponse;
import com.mosaic.accountservice.external.service.KakaoPayService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/external/deposit")
@RequiredArgsConstructor
public class ExternalDepositController {
	private final KakaoPayService kakaoPayService;

	@Value("${BASE_FRONT_URL}")
	private String baseFrontUrl;

	@PostMapping("/ready")
	public ResponseEntity<KakaoPayReadyResponse> getReady(@RequestBody CreatePaymentRequest request,
		@RequestHeader("X-MEMBER-ID") Integer memberId) {
		KakaoPayReadyResponse response = kakaoPayService.getReady(request.amount(), memberId);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/success")
	public void handleExternalDepositSuccess (
		@RequestParam(name = "pg_token") String pgToken, 
		@RequestHeader("X-MEMBER-ID") Integer memberId,
		HttpServletResponse response) throws JsonProcessingException, IOException {
		kakaoPayService.approveKakaoPay(pgToken, memberId);
		response.sendRedirect(baseFrontUrl + "my/myAccount");
	}
}

package com.mosaic.accountservice.external.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.accountservice.external.dto.CreatePaymentRequest;
import com.mosaic.accountservice.external.dto.KakaoPayReadyResponse;
import com.mosaic.accountservice.external.service.KakaoPayService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/external/deposit")
@RequiredArgsConstructor
public class ExternalDepositController {
	private final KakaoPayService kakaoPayService;

	@PostMapping("/ready")
	public ResponseEntity<KakaoPayReadyResponse> getReady(@RequestBody CreatePaymentRequest request,
		@RequestParam Integer memberId) {
		KakaoPayReadyResponse response = kakaoPayService.getReady(request.totalAmount(), memberId);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/success")
	public ResponseEntity<Void> handleExternalDepositSuccess(
		@RequestParam(name = "pg_token") String pgToken) throws JsonProcessingException {
		kakaoPayService.approveKakaoPay(pgToken, 3);
		return ResponseEntity.ok().build();
	}
}

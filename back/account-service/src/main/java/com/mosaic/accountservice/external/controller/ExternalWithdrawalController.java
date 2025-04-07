package com.mosaic.accountservice.external.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.accountservice.external.dto.ExternalWithdrawalRequest;
import com.mosaic.accountservice.external.dto.KakaoPayReadyResponse;
import com.mosaic.accountservice.external.service.ExternalWithdrawalService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/external/withdrawal")
@RequiredArgsConstructor
public class ExternalWithdrawalController {

	private final ExternalWithdrawalService externalWithdrawalService;

	@PostMapping
	public ResponseEntity<KakaoPayReadyResponse> externalWithdraw(@RequestBody ExternalWithdrawalRequest request,
		@RequestHeader("X-MEMBER-ID") Integer memberId) throws JsonProcessingException {
		externalWithdrawalService.withdraw(request.amount(), request.accountNumber(), request.bankCode(), memberId);
		return ResponseEntity.accepted().build();
	}
}

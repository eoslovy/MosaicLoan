package com.mosaic.accountservice.external.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.accountservice.external.dto.KakaoPayReadyResponse;

public interface KakaoPayService {
	KakaoPayReadyResponse getReady(Integer amount, Integer memberId);

	void approveKakaoPay(String pgToken, Integer memberId) throws JsonProcessingException;
}

package com.mosaic.accountservice.external.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import com.mosaic.accountservice.external.dto.KakaoPayApproveJsonRequest;
import com.mosaic.accountservice.external.dto.KakaoPayApproveResponse;
import com.mosaic.accountservice.external.dto.KakaoPayReadyJsonRequest;
import com.mosaic.accountservice.external.dto.KakaoPayReadyJsonResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Component
@Slf4j
public class KakaoPayClient {
	private final WebClient kakaoPayWebClient;

	@Value("${KAKAO_PAY_CALLBACK_BASE_URL}")
	String kakaoPayCallbackBaseUrl;

	@Value("${KAKAO_PAY_CID}")
	String cid;

	public KakaoPayReadyJsonResponse requestReady(Integer memberId, String orderId, Integer amount) {
		KakaoPayReadyJsonRequest request = KakaoPayReadyJsonRequest.builder()
			.cid(cid)
			.partner_order_id(orderId)
			.partner_user_id(memberId.toString())
			.item_name("모자익론 입금")
			.quantity("1")
			.total_amount(amount)
			.tax_free_amount(0)
			.approval_url(kakaoPayCallbackBaseUrl + "/success")
			.fail_url(kakaoPayCallbackBaseUrl + "/fail")
			.cancel_url(kakaoPayCallbackBaseUrl + "/cancel")
			.build();

		return kakaoPayWebClient.post()
			.uri("/v1/payment/ready")
			.bodyValue(request)
			.retrieve()
			.bodyToMono(KakaoPayReadyJsonResponse.class)
			.block();
	}

	public KakaoPayApproveResponse requestApprove(Integer memberId, String orderId, String pgToken, String tid) {
		var request = KakaoPayApproveJsonRequest.builder()
			.cid(cid)
			.tid(tid)
			.partner_order_id(orderId)
			.partner_user_id(memberId.toString())
			.pg_token(pgToken)
			.build();

		return kakaoPayWebClient.post()
			.uri("/v1/payment/approve")
			.bodyValue(request)
			.retrieve()
			.bodyToMono(KakaoPayApproveResponse.class)
			.block();
	}
}

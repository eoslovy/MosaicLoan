package com.mosaic.accountservice.external.dto;

import lombok.Builder;

@Builder
public record KakaoPayApproveJsonRequest(
	String cid,
	String tid,
	String partner_order_id,
	String partner_user_id,
	String pg_token
) {
}
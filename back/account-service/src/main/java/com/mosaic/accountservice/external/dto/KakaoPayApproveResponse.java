package com.mosaic.accountservice.external.dto;

public record KakaoPayApproveResponse(
	String cid,
	String aid,
	String tid,
	String partner_user_id,
	String partner_order_id,
	KakaoPayAmount amount,
	String approved_at
) {
	public record KakaoPayAmount(
		Integer total
	) {
	}
}

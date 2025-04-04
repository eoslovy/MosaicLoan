package com.mosaic.accountservice.external.dto;

import lombok.Builder;

@Builder
public record KakaoPayReadyJsonRequest(
	String cid,
	String partner_order_id,
	String partner_user_id,
	String item_name,
	String quantity,
	Integer total_amount,
	Integer tax_free_amount,
	String approval_url,
	String fail_url,
	String cancel_url
) {
}
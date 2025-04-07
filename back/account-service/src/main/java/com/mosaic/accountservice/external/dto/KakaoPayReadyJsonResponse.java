package com.mosaic.accountservice.external.dto;

public record KakaoPayReadyJsonResponse(String tid, String next_redirect_pc_url, String approved_at) {
}

package com.mosaic.auth.service;

import jakarta.servlet.http.HttpServletResponse;

public interface KakaoOAuthService {
	String getKakaoLoginUrl();

	void processKakaoLogin(String code, HttpServletResponse response);
}

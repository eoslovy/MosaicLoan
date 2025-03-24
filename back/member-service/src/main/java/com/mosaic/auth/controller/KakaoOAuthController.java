package com.mosaic.auth.controller;

import java.io.IOException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mosaic.auth.service.KakaoOAuthService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth/kakao")
public class KakaoOAuthController {

	private final KakaoOAuthService kakaoOAuthService;

	// 1. 로그인 버튼 클릭 시 → 카카오 로그인 페이지로 리다이렉트
	@GetMapping("/login")
	public void KakaoLogin(HttpServletResponse response) throws IOException {
		String redirectUrl = kakaoOAuthService.getKakaoLoginUrl();
		response.sendRedirect(redirectUrl);
	}

	// 2. 로그인 후 리다이렉트되는 콜백
	@GetMapping("/callback")
	public void kakaoCallback(@RequestParam String code, HttpServletResponse response) throws IOException {
		kakaoOAuthService.processKakaoLogin(code, response);
		response.sendRedirect("/me"); // 로그인 성공 시 /me로 리디렉트
	}
}

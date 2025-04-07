package com.mosaic.auth.controller;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mosaic.auth.jwt.JwtProvider;
import com.mosaic.auth.service.MemberService;
import com.mosaic.auth.service.RedisService;
import com.mosaic.auth.util.CookieUtil;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/test")
public class TestController {

	private final JwtProvider jwtProvider;
	private final RedisService redisService;
	private final MemberService memberService;
	private final StringRedisTemplate redisTemplate;

	{
		log.info("TestController 생성됨! 매핑 경로: /test");
	}

	@GetMapping("/public/{testNumber}")
	public ResponseEntity<String> publicEndpoint(@PathVariable Integer testNumber) {
		log.info("Public 엔드포인트 호출됨: /test/public {}", testNumber);
		return ResponseEntity.ok("이 엔드포인트는 인증이 필요하지 않습니다." + testNumber);
	}

	// 테스트용 JWT 토큰 생성 엔드포인트
	@GetMapping("/public/generate-token/{memberId}")
	public ResponseEntity<String> generateToken(
		@PathVariable Integer memberId,
		HttpServletResponse response) {

		log.info("토큰 생성 엔드포인트 호출됨. Member ID: {}", memberId);
		// JWT 토큰 생성
		String accessToken = jwtProvider.createAccessToken(memberId);

		// Redis에 저장
		redisService.saveAccessToken(memberId, accessToken, jwtProvider.getAccessTokenValidity());

		// 쿠키에 저장
		CookieUtil.addCookie(response, "access-token", accessToken,
			(int)(jwtProvider.getAccessTokenValidity() / 1000));

		return ResponseEntity.ok("테스트용 토큰이 생성되었습니다: " + accessToken);
	}
}
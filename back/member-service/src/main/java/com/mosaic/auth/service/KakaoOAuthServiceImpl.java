package com.mosaic.auth.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import com.mosaic.auth.domain.Member;
import com.mosaic.auth.dto.KakaoMemberResponse;
import com.mosaic.auth.dto.KakaoTokenResponse;
import com.mosaic.auth.jwt.JwtProvider;
import com.mosaic.auth.util.CookieUtil;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class KakaoOAuthServiceImpl implements KakaoOAuthService {

	@Value("${kakao.client-id}")
	private String clientId;

	@Value("${kakao.redirect-uri}")
	private String redirectUri;

	private final MemberService memberService;
	private final JwtProvider jwtProvider;
	private final WebClient webClient;

	@Override
	public String getKakaoLoginUrl() {
		return UriComponentsBuilder
			.fromHttpUrl("https://kauth.kakao.com/oauth/authorize")
			.queryParam("client_id", clientId)
			.queryParam("redirect_uri", redirectUri)
			.queryParam("response_type", "code")
			.toUriString();
	}

	@Override
	public void processKakaoLogin(String code, HttpServletResponse response) {
		// 1. 인가코드로 토큰 발급
		KakaoTokenResponse token = getAccessToken(code);

		// 2. 카카오 유저 정보 조회
		KakaoMemberResponse kakaoMember = getMemberInfo(token.getAccessToken());

		// 3. DB 저장 or 기존 유저 조회
		Member member = memberService.findOrCreateMember(kakaoMember);

		// 4. 기존 로그인 세션이 있는지 확인
		String existingToken = jwtProvider.getAccessToken(member.getId());
		if (existingToken != null) {
			// 기존 토큰을 블랙리스트에 추가하여 로그아웃 처리
			jwtProvider.blacklistToken(existingToken, jwtProvider.getAccessTokenValidity());
			jwtProvider.deleteAccessToken(member.getId());
		}

		// 5. 새로운 JWT 발급
		String accessToken = jwtProvider.createAccessToken(member.getId());

		// 6. Redis에 새로운 access token 저장
		jwtProvider.saveAccessToken(member.getId(), accessToken);

		// 7. 액세스 토큰을 쿠키에 저장
		CookieUtil.addCookie(response, "access-token", accessToken,
			(int)(jwtProvider.getAccessTokenValidity() / 1000));
	}

	private KakaoTokenResponse getAccessToken(String code) {
		return webClient.post()
			.uri("https://kauth.kakao.com/oauth/token")
			.bodyValue(String.format("grant_type=authorization_code&client_id=%s&redirect_uri=%s&code=%s",
				clientId, redirectUri, code))
			.header("Content-Type", "application/x-www-form-urlencoded")
			.retrieve()
			.bodyToMono(KakaoTokenResponse.class)
			.block(); // 동기 처리를 위해 block() 사용
	}

	private KakaoMemberResponse getMemberInfo(String accessToken) {
		return webClient.get()
			.uri("https://kapi.kakao.com/v2/user/me")
			.header("Authorization", "Bearer " + accessToken)
			.retrieve()
			.bodyToMono(KakaoMemberResponse.class)
			.block(); // 동기 처리를 위해 block() 사용
	}
}

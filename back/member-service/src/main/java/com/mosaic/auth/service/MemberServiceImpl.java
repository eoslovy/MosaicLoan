package com.mosaic.auth.service;

import java.util.Date;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import com.mosaic.auth.domain.Member;
import com.mosaic.auth.dto.KakaoMemberResponse;
import com.mosaic.auth.dto.MemberInfoResponse;
import com.mosaic.auth.exception.ErrorCode;
import com.mosaic.auth.exception.InvalidTokenException;
import com.mosaic.auth.exception.MemberNotFoundException;
import com.mosaic.auth.jwt.JwtProvider;
import com.mosaic.auth.repository.MemberRepository;
import com.mosaic.auth.util.CookieUtil;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberServiceImpl implements MemberService {

	private final MemberRepository memberRepository;
	private final JwtProvider jwtProvider;
	private final RedisService redisService;
	private final WebClient webClient;

	@Override
	@Transactional
	public Member findOrCreateMember(KakaoMemberResponse kakaoMemberResponse) {
		String oauthId = String.valueOf(kakaoMemberResponse.getId());
		return memberRepository.findByOauthId(oauthId)
			.orElseGet(() -> {
				var newMember = memberRepository.save(
					Member.createMember(oauthId, kakaoMemberResponse.getNickname())
				);

				webClient.post()
					.uri("http://account-service:8080/accounts")
					.header("X-MEMBER-ID", String.valueOf(newMember.getId()))
					.header("X-INTERNAL-CALL", "true")
					.retrieve()
					.bodyToMono(Void.class)
					.block();

				return newMember;
			});
	}

	@Override
	public void logout(HttpServletResponse response, String accessToken) {
		// 토큰 유효성 검증
		if (!jwtProvider.validateToken(accessToken)) {
			throw new InvalidTokenException(ErrorCode.INVALID_TOKEN);
		}

		// 이미 블랙리스트에 있는 토큰인지 확인
		if (redisService.isBlacklisted(accessToken)) {
			throw new InvalidTokenException(ErrorCode.TOKEN_ALREADY_LOGGED_OUT);
		}

		// memberId 추출
		Integer memberId = jwtProvider.getMemberIdFromToken(accessToken);

		// Redis에서 access token 삭제
		redisService.deleteAccessToken(memberId);

		// 액세스 토큰을 블랙리스트에 추가
		Date expiration = jwtProvider.getExpiration(accessToken);
		long expirationMillis = expiration.getTime() - System.currentTimeMillis();
		redisService.addToBlacklist(accessToken, expirationMillis);

		// 액세스 토큰 쿠키 제거
		CookieUtil.deleteCookie(response, "access-token");
	}

	@Override
	public MemberInfoResponse getMemberInfo(Integer memberId) {
		Member member = memberRepository.findById(memberId)
			.orElseThrow(() -> new MemberNotFoundException(ErrorCode.MEMBER_NOT_FOUND));
		return MemberInfoResponse.from(member);
	}
}


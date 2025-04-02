package com.mosaic.auth.jwt;

import java.io.IOException;
import java.util.Date;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.mosaic.auth.domain.Member;
import com.mosaic.auth.dto.MemberPrincipal;
import com.mosaic.auth.exception.CookieNotFoundException;
import com.mosaic.auth.exception.ErrorCode;
import com.mosaic.auth.exception.InvalidTokenException;
import com.mosaic.auth.exception.TokenNotFoundException;
import com.mosaic.auth.repository.MemberRepository;
import com.mosaic.auth.service.RedisService;
import com.mosaic.auth.util.CookieUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private static final String ACCESS_TOKEN_COOKIE_NAME = "access-token";
	private static final long REFRESH_THRESHOLD_MS = 10 * 60 * 1000;

	private final JwtProvider jwtProvider;
	private final RedisService redisService;
	private final MemberRepository memberRepository;

	// 모든 HTTP 요청에 대해 JWT 토큰 검증 및 인증 처리를 수행
	@Override
	protected void doFilterInternal(HttpServletRequest request,
		HttpServletResponse response,
		FilterChain filterChain)
		throws ServletException, IOException {

		try {
			processAuthentication(request, response);
		} catch (TokenNotFoundException e) {
			log.trace("토큰을 찾을 수 없습니다: {}", e.getMessage());
		} catch (InvalidTokenException e) {
			log.debug("유효하지 않은 토큰: {}", e.getMessage());
		} catch (Exception e) {
			log.error("예상치 못한 예외 발생: {}", e.getMessage(), e);
		}

		filterChain.doFilter(request, response);
	}

	// 실제 인증 처리를 수행하는 메인 메서드
	private void processAuthentication(HttpServletRequest request, HttpServletResponse response) {
		String token = extractToken(request);
		if (token != null && isValidToken(token)) {
			Integer memberId = jwtProvider.getMemberIdFromToken(token);
			validateStoredToken(memberId, token);
			processTokenRefreshIfNeeded(token, memberId, response);
			setAuthentication(memberId);
		}
	}

	// Spring Security 인증 정보 설정
	private void setAuthentication(Integer memberId) {
		Member member = memberRepository.findById(memberId)
			.orElseThrow(() -> new InvalidTokenException(ErrorCode.TOKEN_NOT_FOUND));
		MemberPrincipal memberPrincipal = new MemberPrincipal(member.getId(), member.getName(), member.getOauthProvider());
		UsernamePasswordAuthenticationToken authentication =
			new UsernamePasswordAuthenticationToken(memberPrincipal, null, null);
		SecurityContextHolder.getContext().setAuthentication(authentication);
	}

	// JWT 토큰의 유효성을 검사
	private boolean isValidToken(String token) {
		return jwtProvider.validateToken(token) && !redisService.isBlacklisted(token);
	}

	// Redis에 저장된 토큰과 일치하는지 확인
	private void validateStoredToken(Integer memberId, String token) {
		String storedToken = redisService.getAccessToken(memberId);
		if (storedToken == null || !token.equals(storedToken)) {
			throw new InvalidTokenException(ErrorCode.TOKEN_NOT_FOUND);
		}
	}

	// 토큰이 만료 시점에 가까워지면 새로운 토큰을 발급
	private void processTokenRefreshIfNeeded(String token, Integer memberId, HttpServletResponse response) {
		if (isTokenExpiringSoon(token)) {
			String newAccessToken = jwtProvider.createAccessToken(memberId);
			redisService.saveAccessToken(memberId, newAccessToken, jwtProvider.getAccessTokenValidity());
			CookieUtil.addCookie(response, ACCESS_TOKEN_COOKIE_NAME, newAccessToken,
				(int)(jwtProvider.getAccessTokenValidity() / 1000));
		}
	}

	// HTTP 요청의 쿠키에서 액세스 토큰을 추출
	private String extractToken(HttpServletRequest request) {
		try {
			return CookieUtil.getCookieValue(request, ACCESS_TOKEN_COOKIE_NAME);
		} catch (CookieNotFoundException e) {
			return null;
		}
	}

	// 토큰이 만료 시점(10분 전)에 가까워졌는지 확인
	private boolean isTokenExpiringSoon(String token) {
		Date expiration = jwtProvider.getExpiration(token);
		long timeUntilExpiration = expiration.getTime() - System.currentTimeMillis();
		// 만료 갱신
		return timeUntilExpiration < REFRESH_THRESHOLD_MS;
	}
}

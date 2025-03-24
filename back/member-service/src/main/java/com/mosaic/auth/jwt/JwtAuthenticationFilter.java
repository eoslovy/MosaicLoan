package com.mosaic.auth.jwt;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import com.mosaic.auth.dto.MemberPrincipal;
import com.mosaic.auth.exception.InvalidTokenException;
import com.mosaic.auth.exception.TokenNotFoundException;
import com.mosaic.auth.exception.ErrorCode;
import com.mosaic.auth.util.CookieUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private static final String ACCESS_TOKEN_COOKIE_NAME = "access-token";
	private static final long TEN_MINUTES_IN_MILLIS = 10 * 60 * 1000;

	private final JwtProvider jwtProvider;

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
		String token = extractAndValidateToken(request);
		Integer memberId = jwtProvider.getMemberIdFromToken(token);
		validateStoredToken(memberId, token);
		processTokenRefreshIfNeeded(token, memberId, response);
		authenticateUser(memberId, request);
	}

	// JWT 토큰의 유효성을 검사
	private boolean isValidToken(String token) {
		return jwtProvider.validateToken(token) && !jwtProvider.isBlacklisted(token);
	}

	// Redis에 저장된 토큰과 일치하는지 확인
	private void validateStoredToken(Integer memberId, String token) {
		String storedToken = jwtProvider.getAccessToken(memberId);
		if (storedToken == null || !token.equals(storedToken)) {
			throw new InvalidTokenException(ErrorCode.TOKEN_NOT_FOUND);
		}
	}

	// 토큰이 만료 시점에 가까워지면 새로운 토큰을 발급
	private void processTokenRefreshIfNeeded(String token, Integer memberId, HttpServletResponse response) {
		if (isTokenExpiringSoon(token)) {
			String newAccessToken = jwtProvider.createAccessToken(memberId);
			jwtProvider.saveAccessToken(memberId, newAccessToken);
			CookieUtil.addCookie(response, ACCESS_TOKEN_COOKIE_NAME, newAccessToken,
				(int)(jwtProvider.getAccessTokenValidity() / 1000));
		}
	}

	// Spring Security의 인증 컨텍스트에 사용자 정보를 설정
	private void authenticateUser(Integer memberId, HttpServletRequest request) {
		MemberPrincipal memberPrincipal = new MemberPrincipal(memberId);
		UsernamePasswordAuthenticationToken authentication =
			new UsernamePasswordAuthenticationToken(memberPrincipal, null, memberPrincipal.getAuthorities());
		authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
		SecurityContextHolder.getContext().setAuthentication(authentication);
	}

	// HTTP 요청의 쿠키에서 액세스 토큰을 추출
	private String extractAndValidateToken(HttpServletRequest request) {
		String token = extractAccessTokenFromCookie(request);
		if (!isValidToken(token)) {
			throw new InvalidTokenException(ErrorCode.INVALID_TOKEN);
		}
		return token;
	}

	// 토큰이 만료 시점(10분 전)에 가까워졌는지 확인
	private boolean isTokenExpiringSoon(String token) {
		return jwtProvider.getExpiration(token).getTime() - System.currentTimeMillis() < TEN_MINUTES_IN_MILLIS;
	}

	// HTTP 요청의 쿠키에서 액세스 토큰을 추출
	private String extractAccessTokenFromCookie(HttpServletRequest request) {
		try {
			String token = CookieUtil.getCookieValue(request, ACCESS_TOKEN_COOKIE_NAME);
			if (token == null) {
				throw new TokenNotFoundException(ErrorCode.TOKEN_NOT_FOUND);
			}
			return token;
		} catch (Exception e) {
			throw new TokenNotFoundException(ErrorCode.TOKEN_NOT_FOUND, "액세스 토큰을 추출할 수 없습니다: " + e.getMessage());
		}
	}
}

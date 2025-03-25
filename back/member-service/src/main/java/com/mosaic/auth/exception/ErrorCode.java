package com.mosaic.auth.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
	// 인증 관련 에러
	UNAUTHORIZED("AUTH_001", "인증되지 않은 사용자입니다."),
	ACCESS_DENIED("AUTH_002", "접근 권한이 없습니다."),

	// 토큰 관련 에러
	INVALID_TOKEN("TOKEN_001", "유효하지 않은 토큰입니다."),
	TOKEN_ALREADY_LOGGED_OUT("TOKEN_002", "이미 로그아웃된 토큰입니다."),
	TOKEN_NOT_FOUND("TOKEN_003", "토큰을 찾을 수 없습니다."),

	// 쿠키 관련 에러
	COOKIE_NOT_FOUND("COOKIE_001", "요청에 쿠키가 존재하지 않습니다."),
	COOKIE_VALUE_NOT_FOUND("COOKIE_002", "'%s' 쿠키를 찾을 수 없습니다.");

	private final String code;
	private final String defaultMessage;
}

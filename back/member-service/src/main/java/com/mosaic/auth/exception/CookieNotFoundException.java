package com.mosaic.auth.exception;

import lombok.Getter;

@Getter
public class CookieNotFoundException extends RuntimeException {
	private final ErrorCode errorCode;

	public CookieNotFoundException(ErrorCode errorCode) {
		super(errorCode.getDefaultMessage());
		this.errorCode = errorCode;
	}

	public CookieNotFoundException(ErrorCode errorCode, String cookieName) {
		super(String.format(errorCode.getDefaultMessage(), cookieName));
		this.errorCode = errorCode;
	}
}
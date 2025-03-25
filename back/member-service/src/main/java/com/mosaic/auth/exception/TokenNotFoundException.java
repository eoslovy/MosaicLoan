package com.mosaic.auth.exception;

import lombok.Getter;

@Getter
public class TokenNotFoundException extends RuntimeException {
	private final ErrorCode errorCode;

	public TokenNotFoundException(ErrorCode errorCode) {
		super(errorCode.getDefaultMessage());
		this.errorCode = errorCode;
	}

	public TokenNotFoundException(ErrorCode errorCode, String message) {
		super(message);
		this.errorCode = errorCode;
	}
} 
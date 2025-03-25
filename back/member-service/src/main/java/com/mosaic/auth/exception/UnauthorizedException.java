package com.mosaic.auth.exception;

import lombok.Getter;

@Getter
public class UnauthorizedException extends RuntimeException {
	private final ErrorCode errorCode;

	public UnauthorizedException(ErrorCode errorCode) {
		super(errorCode.getDefaultMessage());
		this.errorCode = errorCode;
	}
}
package com.mosaic.auth.exception;

import lombok.Getter;

@Getter
public class InvalidTokenException extends RuntimeException {
	private final ErrorCode errorCode;

	public InvalidTokenException(ErrorCode errorCode) {
		super(errorCode.getDefaultMessage());
		this.errorCode = errorCode;
	}
}
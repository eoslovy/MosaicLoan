package com.mosaic.auth.exception;

import lombok.Getter;

@Getter
public class MemberNotFoundException extends RuntimeException {
	private final ErrorCode errorCode;

	public MemberNotFoundException(ErrorCode errorCode) {
		super(errorCode.getDefaultMessage());
		this.errorCode = errorCode;
	}
}
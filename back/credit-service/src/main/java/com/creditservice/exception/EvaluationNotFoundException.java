package com.creditservice.exception;

import lombok.Getter;

@Getter
public class EvaluationNotFoundException extends RuntimeException {
	private final ErrorCode errorCode;
	private final Integer memberId;

	public EvaluationNotFoundException(ErrorCode errorCode, Integer memberId) {
		super(String.format("%s memberId: %d", errorCode.getDefaultMessage(), memberId));
		this.errorCode = errorCode;
		this.memberId = memberId;
	}
} 
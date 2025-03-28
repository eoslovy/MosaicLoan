package com.mosaic.credit.evaluation.exception;

import lombok.Getter;

@Getter
public class RedisException extends RuntimeException {
    private final ErrorCode errorCode;

    public RedisException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
} 
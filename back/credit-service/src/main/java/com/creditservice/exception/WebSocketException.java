package com.creditservice.exception;

import lombok.Getter;

@Getter
public class WebSocketException extends RuntimeException {
    private final ErrorCode errorCode;

    public WebSocketException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
} 
package com.mosaic.credit.data.exception;

import lombok.Getter;

@Getter
public class DataProcessingException extends RuntimeException {
    private final ErrorCode errorCode;

    public DataProcessingException(ErrorCode errorCode) {
        super(errorCode.getDefaultMessage());
        this.errorCode = errorCode;
    }

    public DataProcessingException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
} 
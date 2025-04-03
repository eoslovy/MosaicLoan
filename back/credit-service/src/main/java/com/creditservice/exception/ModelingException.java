package com.creditservice.exception;

import lombok.Getter;

@Getter
public class ModelingException extends RuntimeException {
    private final ErrorCode errorCode;

    public ModelingException(ErrorCode errorCode) {
        super(errorCode.getDefaultMessage());
        this.errorCode = errorCode;
    }
}
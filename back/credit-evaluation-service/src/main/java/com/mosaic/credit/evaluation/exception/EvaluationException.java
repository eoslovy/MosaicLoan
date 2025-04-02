package com.mosaic.credit.evaluation.exception;

import lombok.Getter;

@Getter
public class EvaluationException extends RuntimeException {
    private final ErrorCode errorCode;

    public EvaluationException(ErrorCode errorCode) {
        super(errorCode.getDefaultMessage());
        this.errorCode = errorCode;
    }
} 
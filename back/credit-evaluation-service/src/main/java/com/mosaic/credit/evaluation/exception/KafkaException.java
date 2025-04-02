package com.mosaic.credit.evaluation.exception;

import lombok.Getter;

@Getter
public class KafkaException extends RuntimeException {
    private final ErrorCode errorCode;

    public KafkaException(ErrorCode errorCode) {
        super(errorCode.getDefaultMessage());
        this.errorCode = errorCode;
    }

    public KafkaException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
} 
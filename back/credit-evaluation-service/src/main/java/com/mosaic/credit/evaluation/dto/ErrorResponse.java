package com.mosaic.credit.evaluation.dto;

import com.mosaic.credit.evaluation.exception.ErrorCode;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ErrorResponse {
    private final ErrorCode code;
    private final String message;
} 
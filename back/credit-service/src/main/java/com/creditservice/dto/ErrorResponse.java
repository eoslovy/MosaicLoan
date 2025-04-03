package com.creditservice.dto;

import com.creditservice.exception.ErrorCode;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ErrorResponse {
    private final ErrorCode code;
    private final String message;
} 
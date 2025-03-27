package com.mosaic.credit.data.dto;

import com.mosaic.credit.data.exception.ErrorCode;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ErrorResponse {
    private final ErrorCode code;
    private final String message;
} 
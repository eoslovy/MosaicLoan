package com.mosaic.auth.dto;

import com.mosaic.auth.exception.ErrorCode;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ErrorResponse {
	private final ErrorCode code;
	private final String message;
} 
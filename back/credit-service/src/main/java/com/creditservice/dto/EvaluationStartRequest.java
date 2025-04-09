package com.creditservice.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class EvaluationStartRequest {
	private String caseId;
	private Integer memberId;
	private LocalDateTime createdAt;
} 
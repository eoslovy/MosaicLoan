package com.creditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ModelingResponseDto {
	private Double prediction;  // 0.0 ~ 1.0
}


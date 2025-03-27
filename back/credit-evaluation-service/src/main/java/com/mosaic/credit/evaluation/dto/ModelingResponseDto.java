package com.mosaic.credit.evaluation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ModelingResponseDto {
	private Double probability;  // 0.0 ~ 1.0
}


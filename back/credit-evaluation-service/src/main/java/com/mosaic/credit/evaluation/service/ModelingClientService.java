package com.mosaic.credit.evaluation.service;

import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.mosaic.credit.evaluation.dto.ModelingRequestDto;
import com.mosaic.credit.evaluation.dto.ModelingResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ModelingClientService {

	private final RestTemplate restTemplate;
	private static final String MODELING_SERVER_URL = "http://model-server/api/predict"; // 실제 모델링 서버로 변경

	public double getRepaymentProbability(Map<String, Object> features) {
		// 테스트용: 실제 모델링 서버 호출 대신 임시 로직 사용
		log.info("테스트용 모델링 서비스 호출: features = {}", features);
		
		// 임시로 0.1 ~ 0.9 사이의 랜덤 값 반환
		double randomProbability = 0.1 + Math.random() * 0.8;
		log.info("테스트용 응답: probability = {}", randomProbability);
		
		return randomProbability;
	}

	// 실제 모델링 서버 호출 메서드 (나중에 사용)
	public double getRealRepaymentProbability(Map<String, Object> features) {
		ModelingRequestDto request = new ModelingRequestDto(features);
		ModelingResponseDto response = restTemplate.postForObject(MODELING_SERVER_URL, request, ModelingResponseDto.class);
		if (response == null || response.getProbability() == null) {
			throw new IllegalStateException("모델링 서버 응답 실패");
		}
		return response.getProbability();
	}
}

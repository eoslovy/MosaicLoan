package com.mosaic.credit.evaluation.service;

import static com.mosaic.credit.evaluation.util.FeatureConstants.*;

import java.util.Map;
import java.util.HashMap;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosaic.credit.evaluation.dto.ModelingRequestDto;
import com.mosaic.credit.evaluation.dto.ModelingResponseDto;
import com.mosaic.credit.evaluation.exception.ModelingException;
import com.mosaic.credit.evaluation.exception.ErrorCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ModelingClientService {

	private final RestTemplate restTemplate;
	private final ObjectMapper objectMapper;
	private static final String MODELING_SERVER_URL = "http://credit-predict:8001/predict";

	public double getRepaymentProbability(Map<String, Object> features) {
		log.info("모델링 서버 호출: features = {}", features);
		
		// 1. feature 데이터 준비
		Map<String, Object> fullFeatureTemplate = prepareFullFeatureTemplate(features);
		
		// 2. 요청 데이터 생성 및 전송
		ModelingRequestDto request = createRequest(fullFeatureTemplate);
		return sendRequest(request);
	}

	private Map<String, Object> prepareFullFeatureTemplate(Map<String, Object> features) {
		try {
			// 1. 전체 feature 키만 null로 초기화
			Map<String, Object> fullFeatureTemplate = initializeFeatureTemplate();
			
			// 2. 요청으로 받은 nested map들을 덮어쓰기
			mergeFeatureData(fullFeatureTemplate, features);
			
			// 3. 최종 flat feature log
			log.info("최종 전송할 features: {}", fullFeatureTemplate);
			
			return fullFeatureTemplate;
		} catch (Exception e) {
			throw new ModelingException(ErrorCode.MODELING_FEATURE_ERROR);
		}
	}

	private Map<String, Object> initializeFeatureTemplate() {
		Map<String, Object> template = new HashMap<>();
		for (String key : FULL_FEATURE_LIST) {
			template.put(key, null);
		}
		return template;
	}

	private void mergeFeatureData(Map<String, Object> template, Map<String, Object> features) {
		String[] featureTypes = {"demographic", "timeseries", "behavior", "credit"};
		for (String type : featureTypes) {
			if (features.containsKey(type)) {
				Map<String, Object> featureData = (Map<String, Object>) features.get(type);
				if (featureData != null) {
					// null이 아닌 값만 업데이트
					featureData.forEach((key, value) -> {
						if (value != null) {
							template.put(key, value);
						}
					});
				}
			}
		}
	}

	private ModelingRequestDto createRequest(Map<String, Object> features) {
		ModelingRequestDto request = new ModelingRequestDto();
		request.setFeatures(features);
		return request;
	}

	private double sendRequest(ModelingRequestDto request) {
		try {
			ModelingResponseDto response = restTemplate.postForObject(MODELING_SERVER_URL, request, ModelingResponseDto.class);
			if (response == null || response.getPrediction() == null) {
				throw new ModelingException(ErrorCode.MODELING_RESPONSE_ERROR);
			}
			return response.getPrediction();
		} catch (RestClientException e) {
			throw new ModelingException(ErrorCode.MODELING_SERVER_ERROR);
		}
	}
}

package com.creditservice.service;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.creditservice.domain.EvaluationCase;
import com.creditservice.dto.EvaluationStartRequest;
import com.creditservice.exception.ErrorCode;
import com.creditservice.exception.KafkaException;
import com.creditservice.repository.EvaluationCaseRepository;
import com.creditservice.util.TimeUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EvaluationRequestServiceImpl implements EvaluationRequestService {

	private final EvaluationCaseRepository caseRepository;
	private final KafkaTemplate<String, Object> kafkaTemplate;
	private final TimeUtil timeUtil;

	@Transactional
	public void requestEvaluation(Integer memberId, Boolean isBot) {
		// 사용되지 않은 case_id 하나 찾기
		EvaluationCase availableCase = caseRepository.findFirstByIsCheckedFalse()
			.orElseThrow(() -> new KafkaException(ErrorCode.NO_AVAILABLE_CASE));

		// 사용 처리
		availableCase.markAsChecked();

		// Kafka에 퍼블리시
		EvaluationStartRequest request = new EvaluationStartRequest();
		request.setCaseId(String.valueOf(availableCase.getCaseId()));
		request.setMemberId(memberId);
		request.setCreatedAt(timeUtil.now(isBot));

		kafkaTemplate.send("EvaluationStart", request)
			.whenComplete((result, ex) -> {
				if (ex != null) {
					throw new KafkaException(ErrorCode.KAFKA_PUBLISH_ERROR,
						"Kafka 메시지 발행 실패: memberId = " + memberId + ", caseId = " + availableCase.getCaseId());
				}
			});
	}
}

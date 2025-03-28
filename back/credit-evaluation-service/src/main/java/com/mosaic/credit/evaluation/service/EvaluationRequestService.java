package com.mosaic.credit.evaluation.service;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mosaic.credit.evaluation.domain.EvaluationCase;
import com.mosaic.credit.evaluation.dto.EvaluationStartRequest;
import com.mosaic.credit.evaluation.exception.ErrorCode;
import com.mosaic.credit.evaluation.exception.KafkaException;
import com.mosaic.credit.evaluation.repository.EvaluationCaseRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EvaluationRequestService {

	private final EvaluationCaseRepository caseRepository;
	private final KafkaTemplate<String, Object> kafkaTemplate;

	@Transactional
	public void requestEvaluation(Integer memberId) {
		// 사용되지 않은 case_id 하나 찾기
		EvaluationCase availableCase = caseRepository.findFirstByIsCheckedFalse()
			.orElseThrow(() -> new KafkaException(ErrorCode.NO_AVAILABLE_CASE));

		// 사용 처리
		availableCase.markAsChecked();

		// Kafka에 퍼블리시
		EvaluationStartRequest request = new EvaluationStartRequest();
		request.setCaseId(String.valueOf(availableCase.getCaseId()));
		request.setMemberId(memberId);

		kafkaTemplate.send("EvaluationStart", request)
			.whenComplete((result, ex) -> {
				if (ex != null) {
					throw new KafkaException(ErrorCode.KAFKA_PUBLISH_ERROR, 
						"Kafka 메시지 발행 실패: memberId = " + memberId + ", caseId = " + availableCase.getCaseId());
				}
			});
	}
}

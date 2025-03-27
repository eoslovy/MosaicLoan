package com.mosaic.credit.evaluation.service;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mosaic.credit.evaluation.domain.EvaluationCase;
import com.mosaic.credit.evaluation.dto.EvaluationStartRequest;
import com.mosaic.credit.evaluation.repository.CreditEvaluationRepository;
import com.mosaic.credit.evaluation.repository.EvaluationCaseRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EvaluationRequestService {

	private final EvaluationCaseRepository caseRepository;
	private final CreditEvaluationRepository evaluationRepository;
	private final KafkaTemplate<String, Object> kafkaTemplate;

	@Transactional
	public void requestEvaluation(Integer memberId) {
		// 사용되지 않은 case_id 하나 찾기
		EvaluationCase availableCase = caseRepository.findFirstByIsCheckedFalse()
			.orElseThrow(() -> new IllegalStateException("사용 가능한 case_id가 없습니다."));

		// 사용 처리
		availableCase.markAsChecked();

		// Kafka에 퍼블리시
		EvaluationStartRequest request = new EvaluationStartRequest();
		request.setCaseId(String.valueOf(availableCase.getCaseId()));
		request.setMemberId(memberId);

		log.info("Kafka 메시지 발행 시작: {}", request);
		kafkaTemplate.send("EvaluationStart", request)
			.whenComplete((result, ex) -> {
				if (ex != null) {
					log.error("Kafka 메시지 발행 실패: {}", ex.getMessage());
				} else {
					log.info("Kafka 메시지 발행 성공: topic={}, partition={}, offset={}", 
						result.getRecordMetadata().topic(),
						result.getRecordMetadata().partition(),
						result.getRecordMetadata().offset());
				}
			});
	}
}

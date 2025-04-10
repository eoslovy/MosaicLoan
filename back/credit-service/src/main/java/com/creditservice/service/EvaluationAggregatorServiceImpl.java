package com.creditservice.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.creditservice.dto.EvaluationResultDto;
import com.creditservice.exception.ErrorCode;
import com.creditservice.exception.EvaluationException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EvaluationAggregatorServiceImpl implements EvaluationAggregatorService {

	private final EvaluationRedisService dataService;
	private final WebSocketService webSocketService;
	private final CalculationService calculationService;

	private static final List<String> EXPECTED_SOURCES = List.of("behavior", "credit", "demographic", "timeseries");
	private final ModelingClientService modelingClientService;

	public void handleIncomingResult(EvaluationResultDto result) {
		String caseId = result.getCaseId();
		String memberId = result.getMemberId();
		String source = result.getSource();

		// 소스 검증
		if (!EXPECTED_SOURCES.contains(source)) {
			throw new EvaluationException(ErrorCode.INVALID_DATA);
		}

		// 중복 메시지 체크
		if (dataService.isAlreadyReceived(caseId, source)) {
			throw new EvaluationException(ErrorCode.DUPLICATE_MESSAGE);
		}

		try {
			// 데이터 저장
			dataService.saveReceivedSource(caseId, source);
			dataService.savePayload(caseId, source, result);
			dataService.saveTimestampIfAbsent(caseId);

			// 모든 데이터가 수집되었는지 확인
			if (dataService.getReceivedCount(caseId) == EXPECTED_SOURCES.size()) {
				// 데이터 집계
				Map<String, Object> mergedPayload = dataService.collectAllPayloads(caseId, EXPECTED_SOURCES);

				// 모델링 서버 호출 시간 측정
				long startTime = System.currentTimeMillis();
				double probability = modelingClientService.getRepaymentProbability(mergedPayload);
				long endTime = System.currentTimeMillis();
				long duration = endTime - startTime;

				log.info("모델링 서버 호출 시간: caseId={}, memberId={}, duration={}ms",
					caseId, memberId, duration);

				// 계산 및 저장
				var evaluation = calculationService.evaluateCredit(Integer.valueOf(caseId), Integer.valueOf(memberId),
					probability);

				// WebSocket으로 완료 알림 전송
				webSocketService.sendEvaluationComplete(Integer.valueOf(memberId), evaluation.getStatus());

				// 데이터 정리
				dataService.cleanup(caseId, EXPECTED_SOURCES);
			}
		} catch (Exception e) {
			log.error("평가 처리 중 오류 발생: caseId={}, memberId={}, source={}, error={}",
				caseId, memberId, source, e.getMessage());
			throw new EvaluationException(ErrorCode.PROCESSING_ERROR);
		}
	}
}

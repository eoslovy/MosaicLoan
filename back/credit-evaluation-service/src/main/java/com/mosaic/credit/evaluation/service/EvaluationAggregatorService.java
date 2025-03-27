package com.mosaic.credit.evaluation.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.mosaic.credit.evaluation.dto.EvaluationResultDto;
import com.mosaic.credit.evaluation.exception.EvaluationException;
import com.mosaic.credit.evaluation.exception.ErrorCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EvaluationAggregatorService {

	private final EvaluationDataService dataService;
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
				log.info("최종 평가 데이터: {}", mergedPayload);

				// ✅ 모델링 서버 호출
				double probability = modelingClientService.getRepaymentProbability(mergedPayload);

				// ✅ 계산 및 저장
				calculationService.evaluateCredit(Integer.valueOf(caseId), Integer.valueOf(memberId), probability);

				// WebSocket으로 결과 전송
				webSocketService.sendResult(caseId, mergedPayload);

				// 데이터 정리
				dataService.cleanup(caseId, EXPECTED_SOURCES);
			}
		} catch (Exception e) {
			throw new EvaluationException(ErrorCode.PROCESSING_ERROR);
		}
	}
}

package com.creditservice.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.creditservice.domain.CreditEvaluation;
import com.creditservice.domain.EconomySentiment;
import com.creditservice.domain.EvaluationStatus;
import com.creditservice.dto.EvaluationResultDto;
import com.creditservice.repository.CreditEvaluationRepository;
import com.creditservice.repository.EconomySentimentRepository;
import com.creditservice.util.RiskBasedYieldCalculator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CalculationServiceImpl implements CalculationService {

	private final CreditEvaluationRepository evaluationRepository;
	private final EvaluationRedisService evaluationRedisService;
	private final EconomySentimentRepository economySentimentRepository;

	public CreditEvaluation createAndSaveEvaluation(Integer caseId, Integer memberId, Integer defaultRate,
		Integer interestRate, Integer expectedYield, Integer maxLoanLimit, EvaluationStatus status) {
		CreditEvaluation evaluation = CreditEvaluation.builder()
			.memberId(memberId)
			.defaultRate(defaultRate)
			.interestRate(interestRate)
			.expectedYield(expectedYield)
			.maxLoanLimit(maxLoanLimit)
			.createdAt(LocalDateTime.now())
			.caseId(caseId)
			.status(status)
			.build();

		return evaluationRepository.save(evaluation);
	}

	// 전일 경제 심리지수를 조회하는 메서드
	private double getYesterdaySentiment() {
		LocalDate yesterday = LocalDate.now().minusDays(1);
		Optional<EconomySentiment> sentimentOpt = economySentimentRepository.findBySentimentDate(yesterday);

		if (sentimentOpt.isPresent()) {
			double sentiment = sentimentOpt.get().getAverageSentiment();
			return sentiment;
		} else {
			return 0.0;
		}
	}

	@Override
	public CreditEvaluation evaluateCredit(Integer caseId, Integer memberId, double probability) {
		// 1. 부도 확률 계산
		int defaultRate = (int)Math.round(probability * 10000);

		// 2. 이자율 계산 (무위험 이자율 4%, 손실률 0.5 가정)
		double riskFreeRate = 0.04;

		// 전날의 경제 심리지수를 가져와 이자율에 반영
		double sentiment = getYesterdaySentiment();
		riskFreeRate -= sentiment * 0.0025; // 범위에 따라 ±0.25% 조정

		double lossGivenDefault = 0.5;
		double adjustProbability = probability * 53;
		BigDecimal assignedInterest = RiskBasedYieldCalculator.calculateAssignedRate(probability);

		Integer expectedYield = RiskBasedYieldCalculator.calculateExpectedYield(probability)
			.multiply(BigDecimal.valueOf(10000))
			.intValue();

		Integer interestRate = (int)(riskFreeRate * 10000) + assignedInterest.add(BigDecimal.valueOf(riskFreeRate))
			.multiply(BigDecimal.valueOf(10000))
			.intValue();

		// 3. DSR 기반 대출 한도 계산
		// Redis에서 데이터 가져오기rm
		String caseIdStr = String.valueOf(caseId);
		Optional<EvaluationResultDto> demographicData = evaluationRedisService.getPayload(caseIdStr, "demographic");
		Optional<EvaluationResultDto> creditData = evaluationRedisService.getPayload(caseIdStr, "credit");

		// DSR 계산이 가능한 경우에만 수행
		if (demographicData.isPresent() && creditData.isPresent()) {
			Map<String, Object> demographicPayload = demographicData.get().getPayload();
			Map<String, Object> creditPayload = creditData.get().getPayload();

			if (demographicPayload.containsKey("total_income") && creditPayload.containsKey(
				"totaldebtoverduevalue_178A")) {
				Double totalIncome = Double.parseDouble(demographicPayload.get("total_income").toString());
				Double totalDebt = Double.parseDouble(creditPayload.get("totaldebtoverduevalue_178A").toString());

				double monthlyIncome = totalIncome * 1400 / 12;
				double monthlyDebt = totalDebt * 1400 / 12;

				// DSR 계산 (월상환액/월소득)
				double dsr = monthlyDebt / monthlyIncome;

				log.info("DSR 계산: caseId={}, memberId={}, dsr={}, monthlyIncome={}, monthlyDebt={}",
					caseId, memberId, dsr, monthlyIncome, monthlyDebt);

				// DSR이 40%를 넘으면 대출 불가
				if (dsr > 0.4) {
					return createAndSaveEvaluation(caseId, memberId, defaultRate, interestRate, 0, 0,
						EvaluationStatus.DSR_EXCEEDED);
				}

				// DSR에 따른 대출 한도 계산 (남은 DSR 여유분 * 월소득 * 12)
				int maxLoanLimit = (int)((0.4 - dsr) * monthlyIncome * 12);
				return createAndSaveEvaluation(caseId, memberId, defaultRate, interestRate, maxLoanLimit, expectedYield,
					EvaluationStatus.APPROVED);
			}
		}

		// DSR 계산이 불가능한 경우 기본 대출 한도 설정
		log.info("DSR 계산 불가: caseId={}, memberId={}, 기본 대출 한도 적용", caseId, memberId);
		return createAndSaveEvaluation(caseId, memberId, defaultRate, interestRate, 1000000, expectedYield,
			EvaluationStatus.APPROVED);
	}
}

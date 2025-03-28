package com.mosaic.credit.evaluation.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mosaic.credit.evaluation.domain.CreditEvaluation;
import com.mosaic.credit.evaluation.repository.CreditEvaluationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CalculationService {

	private final CreditEvaluationRepository evaluationRepository;

	@Transactional
	public CreditEvaluation evaluateCredit(Integer caseId, Integer memberId, double probability) {
		// 1. 부도 확률 계산
		int defaultRate = (int)Math.round(probability * 10000);

		// 2. 이자율 계산 (무위험 이자율 4%, 손실률 0.5 가정)
		double riskFreeRate = 0.04;
		double lossGivenDefault = 0.5;
		int interestRate = (int)Math.round(
			(riskFreeRate + (defaultRate * lossGivenDefault) / defaultRate) * 10000);

		// 3. 대출 가능 한도 계산 (예시: 1000만 원 * 신뢰도)
		int maxLoanLimit = (int) (10000000 * probability); // 가변 조정 가능

		// 4. 저장
		CreditEvaluation evaluation = CreditEvaluation.builder()
			.memberId(memberId)
			.defaultRate(defaultRate)
			.interestRate(interestRate)
			.maxLoanLimit(maxLoanLimit)
			.createdAt(LocalDateTime.now())
			.caseId(caseId)
			.build();

		return evaluationRepository.save(evaluation);
	}
}

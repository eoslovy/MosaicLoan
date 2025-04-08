package com.creditservice.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * 리스크 프리미엄 기반 기대 수익률 계산 유틸
 * (Expected Yield = riskFreeRate + α × (PD × LGD)^γ + policyMargin)
 */
public class RiskBasedYieldCalculator {
	private static final BigDecimal BASE_RATE = BigDecimal.valueOf(0.04);         // 무위험 수익률 (4%)
	private static final BigDecimal LGD = BigDecimal.valueOf(0.5);                // 부도시 손실률 (50%)
	private static final BigDecimal ALPHA = BigDecimal.valueOf(12.0);             // 리스크 민감도 계수
	private static final BigDecimal POLICY_MARGIN = BigDecimal.valueOf(0.01);     // 정책 마진 (1%)
	private static final double GAMMA = 1.6;                                       // 위험 반응 지수
	private static final BigDecimal LEGAL_CAP = BigDecimal.valueOf(0.20);         // 법정 금리 상한

	/**
	 * 생존 시 실질 이자율 계산
	 */
	public static BigDecimal calculateAssignedRate(double probabilityOfDefault) {
		validatePd(probabilityOfDefault);

		BigDecimal pd = BigDecimal.valueOf(probabilityOfDefault);
		BigDecimal expectedLoss = pd.multiply(LGD); // PD × LGD

		double premium = ALPHA.doubleValue() * Math.pow(expectedLoss.doubleValue(), GAMMA) + POLICY_MARGIN.doubleValue();
		BigDecimal assignedRate = BASE_RATE.add(BigDecimal.valueOf(premium));

		if (assignedRate.compareTo(LEGAL_CAP) > 0) {
			assignedRate = LEGAL_CAP;
		}

		return assignedRate.setScale(4, RoundingMode.HALF_UP);
	}

	/**
	 * 기대수익률 계산: assignedRate × (1 - PD × LGD)
	 */
	public static BigDecimal calculateExpectedYield(double probabilityOfDefault) {
		BigDecimal assignedRate = calculateAssignedRate(probabilityOfDefault);
		BigDecimal pd = BigDecimal.valueOf(probabilityOfDefault);
		BigDecimal lossImpact = pd.multiply(LGD);
		BigDecimal oneMinus = BigDecimal.ONE.subtract(lossImpact);

		return assignedRate.multiply(oneMinus).setScale(4, RoundingMode.HALF_UP);
	}

	/**
	 * 손실 시 손해율 계산: assignedRate × LGD
	 */
	public static BigDecimal calculateLossOnDefault(double probabilityOfDefault) {
		BigDecimal assignedRate = calculateAssignedRate(probabilityOfDefault);
		return assignedRate.multiply(LGD).setScale(4, RoundingMode.HALF_UP);
	}

	private static void validatePd(double pd) {
		if (pd < 0.0 || pd > 1.0) {
			throw new IllegalArgumentException("부도확률(PD)은 0.0 ~ 1.0 사이여야 합니다.");
		}
	}
}


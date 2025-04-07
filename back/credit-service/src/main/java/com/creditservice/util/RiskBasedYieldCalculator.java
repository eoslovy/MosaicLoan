package com.creditservice.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * 리스크 프리미엄 기반 기대 수익률 계산 유틸
 * (Expected Yield = riskFreeRate + α × (PD × LGD)^γ + policyMargin)
 */
public class RiskBasedYieldCalculator {
	// 정책 파라미터
	private static final BigDecimal BASE_RATE = BigDecimal.valueOf(0.04);         // 무위험 수익률 (4%)
	private static final BigDecimal LGD = BigDecimal.valueOf(0.5);                // 부도시 손실률 (50%)
	private static final BigDecimal ALPHA = BigDecimal.valueOf(12.0);             // 리스크 민감도 계수
	private static final BigDecimal POLICY_MARGIN = BigDecimal.valueOf(0.01);     // 정책 마진 (1%)
	private static final double GAMMA = 1.6;                                       // 위험 반응 지수
	private static final BigDecimal LEGAL_CAP = BigDecimal.valueOf(0.20);         // 법정 금리 상한 20%
	/**
	 * 부도확률을 기반으로 기대수익률을 계산한다.
	 *
	 * @param probabilityOfDefault 부도확률 (0.0 ~ 1.0)
	 * @return 기대수익률 (0.0 ~ 1.0)
	 */
	public static BigDecimal calculateExpectedYield(double probabilityOfDefault) {
		if (probabilityOfDefault < 0.0 || probabilityOfDefault > 1.0) {
			throw new IllegalArgumentException("부도확률(PD)은 0.0 ~ 1.0 사이여야 합니다.");
		}

		BigDecimal pd = BigDecimal.valueOf(probabilityOfDefault);
		BigDecimal expectedLoss = pd.multiply(LGD); // PD × LGD

		double riskPremium = ALPHA.doubleValue() * Math.pow(expectedLoss.doubleValue(), GAMMA) + POLICY_MARGIN.doubleValue();
		BigDecimal assignedRate = BASE_RATE.add(BigDecimal.valueOf(riskPremium));

		// 법정 이자율 상한 적용
		if (assignedRate.compareTo(LEGAL_CAP) > 0) {
			assignedRate = LEGAL_CAP;
		}

		// 기대수익률 계산: (1 - PD) * assignedRate + (-LGD) * PD
		BigDecimal oneMinusPd = BigDecimal.ONE.subtract(pd);
		BigDecimal expectedReturn = oneMinusPd.multiply(assignedRate).add(pd.multiply(LGD).negate());

		return expectedReturn.setScale(4, RoundingMode.HALF_UP);
	}
}


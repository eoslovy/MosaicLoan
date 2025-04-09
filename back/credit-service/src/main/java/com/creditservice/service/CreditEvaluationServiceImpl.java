package com.creditservice.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.creditservice.domain.CreditEvaluation;
import com.creditservice.dto.CreditEvaluationResponseDto;
import com.creditservice.exception.ErrorCode;
import com.creditservice.exception.EvaluationNotFoundException;
import com.creditservice.repository.CreditEvaluationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CreditEvaluationServiceImpl implements CreditEvaluationService {

	private final CreditEvaluationRepository creditEvaluationRepository;
	private final JdbcTemplate jdbcTemplate;

	@Override
	public List<CreditEvaluationResponseDto> getEvaluationsByMemberId(Integer memberId) {
		List<CreditEvaluation> evaluations = creditEvaluationRepository.findByMemberIdOrderByCreatedAtDesc(memberId);
		if (evaluations.isEmpty()) {
			throw new EvaluationNotFoundException(ErrorCode.EVALUATION_NOT_FOUND, memberId);
		}
		return evaluations.stream()
			.map(this::convertToDtoWithDefaultFlag)
			.collect(Collectors.toList());
	}

	@Override
	public CreditEvaluationResponseDto getLatestEvaluationByMemberId(Integer memberId) {
		return creditEvaluationRepository.findTopByMemberIdOrderByCreatedAtDesc(memberId)
			.map(evaluation -> {
				// 평가 결과가 24시간을 초과했는지 확인
				LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
				LocalDateTime createdAt = evaluation.getCreatedAt();
				long hoursDiff = ChronoUnit.HOURS.between(createdAt, now);
				log.info("서버 로컬 시각 : {} DB 시각 : {} 시간 차이 : {}", now, createdAt, hoursDiff);
				if (hoursDiff >= 24) {
					throw new EvaluationNotFoundException(ErrorCode.EVALUATION_EXPIRED, memberId);
				}

				return convertToDtoWithDefaultFlag(evaluation);
			})
			.orElseThrow(() -> new EvaluationNotFoundException(ErrorCode.LATEST_EVALUATION_NOT_FOUND, memberId));
	}

	private CreditEvaluationResponseDto convertToDtoWithDefaultFlag(CreditEvaluation evaluation) {
		// 외부 DB에서 defaultFlag 값을 조회
		Boolean defaultFlag = getDefaultFlagForCaseId(evaluation.getCaseId());

		return CreditEvaluationResponseDto.builder()
			.id(evaluation.getId())
			.memberId(evaluation.getMemberId())
			.defaultRate(evaluation.getDefaultRate())
			.interestRate(evaluation.getInterestRate())
			.maxLoanLimit(evaluation.getMaxLoanLimit())
			.createdAt(evaluation.getCreatedAt())
			.caseId(evaluation.getCaseId())
			.status(evaluation.getStatus())
			.defaultFlag(defaultFlag)
			.build();
	}

	private Boolean getDefaultFlagForCaseId(Integer caseId) {
		try {
			// behavior_analysis DB에서 조회
			Optional<Integer> behaviorDefaultFlag = getDefaultFlagFromBehaviorAnalysis(caseId);
			if (behaviorDefaultFlag.isPresent()) {
				return convertToBoolean(behaviorDefaultFlag.get());
			}

			// credit_evaluation DB에서 조회
			Optional<Integer> creditDefaultFlag = getDefaultFlagFromCreditEvaluation(caseId);
			if (creditDefaultFlag.isPresent()) {
				return convertToBoolean(creditDefaultFlag.get());
			}

			// demographics DB에서 조회
			Optional<Integer> demographicsDefaultFlag = getDefaultFlagFromDemographics(caseId);
			if (demographicsDefaultFlag.isPresent()) {
				return convertToBoolean(demographicsDefaultFlag.get());
			}

			// timeseries_feature DB에서 조회
			Optional<Integer> timeseriesDefaultFlag = getDefaultFlagFromTimeseriesFeature(caseId);
			if (timeseriesDefaultFlag.isPresent()) {
				return convertToBoolean(timeseriesDefaultFlag.get());
			}
		} catch (Exception e) {
			log.error("caseId {}에 대한 defaultFlag 값 조회 중 오류 발생: {}", caseId, e.getMessage());
		}

		return false;
	}

	private Boolean convertToBoolean(Integer value) {
		return value != null && value == 1;
	}

	private Optional<Integer> getDefaultFlagFromBehaviorAnalysis(Integer caseId) {
		try {
			String sql = "SELECT target FROM behavior_analysis WHERE case_id = ?";
			return Optional.ofNullable(jdbcTemplate.queryForObject(sql, Integer.class, caseId));
		} catch (Exception e) {
			return Optional.empty();
		}
	}

	private Optional<Integer> getDefaultFlagFromCreditEvaluation(Integer caseId) {
		try {
			String sql = "SELECT target FROM credit_evaluation WHERE case_id = ?";
			return Optional.ofNullable(jdbcTemplate.queryForObject(sql, Integer.class, caseId));
		} catch (Exception e) {
			return Optional.empty();
		}
	}

	private Optional<Integer> getDefaultFlagFromDemographics(Integer caseId) {
		try {
			String sql = "SELECT target FROM demographics WHERE case_id = ?";
			return Optional.ofNullable(jdbcTemplate.queryForObject(sql, Integer.class, caseId));
		} catch (Exception e) {
			return Optional.empty();
		}
	}

	private Optional<Integer> getDefaultFlagFromTimeseriesFeature(Integer caseId) {
		try {
			String sql = "SELECT target FROM timeseries_feature WHERE case_id = ?";
			return Optional.ofNullable(jdbcTemplate.queryForObject(sql, Integer.class, caseId));
		} catch (Exception e) {
			return Optional.empty();
		}
	}
} 
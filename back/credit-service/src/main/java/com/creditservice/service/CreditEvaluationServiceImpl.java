package com.creditservice.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.creditservice.domain.CreditEvaluation;
import com.creditservice.domain.EvaluationStatus;
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
				if (evaluation.getStatus().equals(EvaluationStatus.DECLINED)) {
					throw new EvaluationNotFoundException(ErrorCode.EVALUATION_NOT_FOUND, memberId);
				}
				return convertToDtoWithDefaultFlag(evaluation);
			})
			.orElseThrow(() -> new EvaluationNotFoundException(ErrorCode.LATEST_EVALUATION_NOT_FOUND, memberId));
	}

	private CreditEvaluationResponseDto convertToDtoWithDefaultFlag(CreditEvaluation evaluation) {
		// 외부 DB에서 defaultFlag 값을 조회

		return CreditEvaluationResponseDto.builder()
			.id(evaluation.getId())
			.memberId(evaluation.getMemberId())
			.defaultRate(evaluation.getDefaultRate())
			.interestRate(evaluation.getInterestRate())
			.maxLoanLimit(evaluation.getMaxLoanLimit())
			.createdAt(evaluation.getCreatedAt())
			.caseId(evaluation.getCaseId())
			.status(evaluation.getStatus())
			.defaultFlag(evaluation.getDefaultFlag())
			.expectYield(evaluation.getExpectYield())
			.build();
	}
} 
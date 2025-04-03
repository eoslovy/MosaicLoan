package com.creditservice.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.creditservice.domain.CreditEvaluation;
import com.creditservice.dto.CreditEvaluationResponseDto;
import com.creditservice.exception.ErrorCode;
import com.creditservice.exception.EvaluationNotFoundException;
import com.creditservice.repository.CreditEvaluationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CreditEvaluationServiceImpl implements CreditEvaluationService {

    private final CreditEvaluationRepository creditEvaluationRepository;

    @Override
    public List<CreditEvaluationResponseDto> getEvaluationsByMemberId(Integer memberId) {
        List<CreditEvaluation> evaluations = creditEvaluationRepository.findByMemberIdOrderByCreatedAtDesc(memberId);
        if (evaluations.isEmpty()) {
            throw new EvaluationNotFoundException(ErrorCode.EVALUATION_NOT_FOUND, memberId);
        }
        return evaluations.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    @Override
    public CreditEvaluationResponseDto getLatestEvaluationByMemberId(Integer memberId) {
        return creditEvaluationRepository.findTopByMemberIdOrderByCreatedAtDesc(memberId)
            .map(evaluation -> {
                // 평가 결과가 24시간을 초과했는지 확인
                LocalDateTime now = LocalDateTime.now();
                LocalDateTime createdAt = evaluation.getCreatedAt();
                long hoursDiff = ChronoUnit.HOURS.between(createdAt, now);
                
                if (hoursDiff > 24) {
                    throw new EvaluationNotFoundException(ErrorCode.EVALUATION_EXPIRED, memberId);
                }
                
                return convertToDto(evaluation);
            })
            .orElseThrow(() -> new EvaluationNotFoundException(ErrorCode.LATEST_EVALUATION_NOT_FOUND, memberId));
    }

    private CreditEvaluationResponseDto convertToDto(CreditEvaluation evaluation) {
        return CreditEvaluationResponseDto.builder()
            .id(evaluation.getId())
            .memberId(evaluation.getMemberId())
            .defaultRate(evaluation.getDefaultRate())
            .interestRate(evaluation.getInterestRate())
            .maxLoanLimit(evaluation.getMaxLoanLimit())
            .createdAt(evaluation.getCreatedAt())
            .caseId(evaluation.getCaseId())
            .status(evaluation.getStatus())
            .build();
    }
} 
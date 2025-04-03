package com.creditservice.service;

import java.util.List;

import com.creditservice.dto.CreditEvaluationResponseDto;

public interface CreditEvaluationService {
    List<CreditEvaluationResponseDto> getEvaluationsByMemberId(Integer memberId);
    CreditEvaluationResponseDto getLatestEvaluationByMemberId(Integer memberId);
} 
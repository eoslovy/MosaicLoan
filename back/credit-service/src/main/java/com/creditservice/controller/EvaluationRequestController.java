package com.creditservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.creditservice.dto.CreditEvaluationResponseDto;
import com.creditservice.service.CreditEvaluationService;
import com.creditservice.service.EvaluationRequestService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/evaluations")
public class EvaluationRequestController {

	private final EvaluationRequestService evaluationRequestService;
	private final CreditEvaluationService creditEvaluationService;

	@PostMapping
	public ResponseEntity<String> requestEvaluation(@RequestHeader("X-MEMBER-ID") Integer memberId) {
		evaluationRequestService.requestEvaluation(memberId);
		return ResponseEntity.ok("신용평가 요청이 완료되었습니다.");
	}

	@GetMapping
	public ResponseEntity<List<CreditEvaluationResponseDto>> getEvaluationsByMemberId(
		@RequestHeader("X-MEMBER-ID") Integer memberId) {
		return ResponseEntity.ok(creditEvaluationService.getEvaluationsByMemberId(memberId));
	}

	@GetMapping("/recent")
	public ResponseEntity<CreditEvaluationResponseDto> getLatestEvaluationByMemberId(
		@RequestHeader("X-MEMBER-ID") Integer memberId) {
		CreditEvaluationResponseDto latestEvaluation = creditEvaluationService.getLatestEvaluationByMemberId(memberId);
		return latestEvaluation != null ? ResponseEntity.ok(latestEvaluation) : ResponseEntity.notFound().build();
	}
}

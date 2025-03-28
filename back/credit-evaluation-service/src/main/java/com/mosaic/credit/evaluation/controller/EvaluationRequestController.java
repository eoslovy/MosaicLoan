package com.mosaic.credit.evaluation.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mosaic.credit.evaluation.service.EvaluationRequestService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/evaluation")
public class EvaluationRequestController {

	private final EvaluationRequestService evaluationRequestService;

	@PostMapping
	public ResponseEntity<String> requestEvaluation(@RequestParam Integer memberId) {
		evaluationRequestService.requestEvaluation(memberId);
		return ResponseEntity.ok("신용평가 요청이 완료되었습니다.");
	}
}

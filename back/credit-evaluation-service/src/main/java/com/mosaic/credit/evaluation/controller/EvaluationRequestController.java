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

	// private final KafkaTemplate<String, Object> kafkaTemplate;
	private final EvaluationRequestService evaluationRequestService;

	// @PostMapping
	// public ResponseEntity<String> evaluate(@RequestParam String caseId) {
	// 	kafkaTemplate.send("EvaluationStart", caseId);
	// 	return ResponseEntity.ok("Evaluation started: " + caseId);
	// }

	@PostMapping
	public ResponseEntity<String> requestEvaluation(@RequestParam Integer memberId) {
		try {
			evaluationRequestService.requestEvaluation(memberId);
			return ResponseEntity.ok("신용평가 요청이 완료되었습니다.");
		} catch (IllegalStateException e) {
			return ResponseEntity.badRequest().body("❌ 요청 실패: " + e.getMessage());
		}
	}
}

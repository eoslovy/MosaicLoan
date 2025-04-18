package com.mosaic.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class HealthCheckController {

	@GetMapping("/health")
	public ResponseEntity<String> healthCheck() {
		log.info("헬스 체크 요청이 도착했습니다: /health");
		return ResponseEntity.ok("OK");
	}

	@GetMapping("/no-security")
	public ResponseEntity<String> noSecurity() {
		log.info("보안 없는 엔드포인트 요청이 도착했습니다: /no-security");
		return ResponseEntity.ok("NO SECURITY ENDPOINT WORKS!");
	}

	@GetMapping("/simple-test")
	public ResponseEntity<String> simpleTest() {
		log.info("간단한 테스트 엔드포인트 요청이 도착했습니다: /simple-test");
		return ResponseEntity.ok("SIMPLE TEST ENDPOINT WORKS!");
	}
}
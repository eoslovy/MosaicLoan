package com.mosaic.accountservice.account.controller;

import java.math.BigDecimal;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/kafka/test")
public class KafkaTestController {

	private final TestKafkaPublisher publisher;

	@PostMapping("/deposit")
	public void testDeposit(@RequestParam int accountId, @RequestParam BigDecimal amount) {
		publisher.publishExternalDeposit(accountId, amount);
	}

	@PostMapping("/withdrawal")
	public void testWithdrawal(@RequestParam int accountId,
		@RequestParam BigDecimal amount) {
		publisher.publishExternalWithdrawal(accountId, amount);
	}

	@PostMapping("/create-account")
	public void testAccountCreation(@RequestParam int memberId) {
		publisher.publishAccountCreation(memberId);
	}
}
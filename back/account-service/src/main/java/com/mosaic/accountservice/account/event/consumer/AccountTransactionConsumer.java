package com.mosaic.accountservice.account.event.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosaic.accountservice.account.service.AccountTransactionService;
import com.mosaic.payload.AccountTransactionPayload;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class AccountTransactionConsumer {
	private final AccountTransactionService service;
	private final ObjectMapper objectMapper;

	@KafkaListener(topics = "external.deposit.requested", groupId = "account.external-deposit-requested.consumer")
	public void handleExternalDepositRequested(String message) throws JsonProcessingException {
		AccountTransactionPayload payload = objectMapper.readValue(message, AccountTransactionPayload.class);
		service.handleExternalDeposit(payload);
	}

	@KafkaListener(topics = "external.withdrawal.requested", groupId = "account.external-withdrawal-requested.consumer")
	public void handleExternalWithdrawalRequested(String message) throws JsonProcessingException {
		AccountTransactionPayload payload = objectMapper.readValue(message, AccountTransactionPayload.class);
		service.handleExternalWithdrawal(payload);
	}

	@KafkaListener(topics = "investment.deposit.requested", groupId = "account.investment-deposit-requested.consumer")
	public void handleInvestmentDepositRequested(String message) throws JsonProcessingException {
		log.info("[INVESTMENT DEPOSIT REQUESTED] message: {}", message);
		AccountTransactionPayload payload = objectMapper.readValue(message, AccountTransactionPayload.class);
		service.handleInvestmentDeposit(payload);
	}

	@KafkaListener(topics = "investment.withdrawal.requested", groupId = "account.investment-withdrawal-requested.consumer")
	public void handleInvestmentWithdrawalRequested(String message) throws JsonProcessingException {
		AccountTransactionPayload payload = objectMapper.readValue(message, AccountTransactionPayload.class);
		service.handleInvestmentWithdrawal(payload);
	}

	@KafkaListener(topics = "loan.deposit.requested", groupId = "account.loan-deposit-requested.consumer")
	public void handleLoanDepositRequested(String message) throws JsonProcessingException {
		AccountTransactionPayload payload = objectMapper.readValue(message, AccountTransactionPayload.class);
		service.handleLoanDeposit(payload);
	}

	@KafkaListener(topics = "loan.withdrawal.requested", groupId = "account.loan-withdrawal-requested.consumer")
	public void handleLoanWithdrawalRequested(String message) throws JsonProcessingException {
		AccountTransactionPayload payload = objectMapper.readValue(message, AccountTransactionPayload.class);
		service.handleLoanWithdrawal(payload);
	}

	// 외부 입출금은 현재 상태에서는 failed가 없음
	// @KafkaListener(topics = "external.deposit.failed", groupId = "account.external-deposit-failed.consumer")
	// public void handleExternalDepositFailed(String message) throws JsonProcessingException {
	// 	AccountTransactionPayload payload = objectMapper.readValue(message, AccountTransactionPayload.class);
	// 	service.handleExternalDeposit(payload);
	// }
	//
	// @KafkaListener(topics = "external.withdrawal.failed", groupId = "account.external-withdrawal-failed.consumer")
	// public void handleExternalWithdrawalFailed(String message) throws JsonProcessingException {
	// 	AccountTransactionPayload payload = objectMapper.readValue(message, AccountTransactionPayload.class);
	// 	service.handleExternalWithdrawal(payload);
	// }

	@KafkaListener(topics = "investment.deposit.failed", groupId = "account.investment-deposit-failed.consumer")
	public void handleInvestmentDepositFailed(String message) throws JsonProcessingException {
		AccountTransactionPayload payload = objectMapper.readValue(message, AccountTransactionPayload.class);
		service.compensateInvestmentDepositFailure(payload);
	}

	@KafkaListener(topics = "investment.withdrawal.failed", groupId = "account.investment-withdrawal-failed.consumer")
	public void handleInvestmentWithdrawalFailed(String message) throws JsonProcessingException {
		AccountTransactionPayload payload = objectMapper.readValue(message, AccountTransactionPayload.class);
		service.compensateInvestmentWithdrawalFailure(payload);
	}

	@KafkaListener(topics = "loan.deposit.failed", groupId = "account.loan-deposit-failed.consumer")
	public void handleLoanDepositFailed(String message) throws JsonProcessingException {
		AccountTransactionPayload payload = objectMapper.readValue(message, AccountTransactionPayload.class);
		service.compensateLoanDepositFailure(payload);
	}

	@KafkaListener(topics = "loan.withdrawal.failed", groupId = "account.loan-withdrawal-failed.consumer")
	public void handleLoanWithdrawalFailed(String message) throws JsonProcessingException {
		AccountTransactionPayload payload = objectMapper.readValue(message, AccountTransactionPayload.class);
		service.compensateLoanWithdrawalFailure(payload);
	}
}

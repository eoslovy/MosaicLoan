package com.mosaic.accountservice.external.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosaic.accountservice.external.model.BankCode;
import com.mosaic.accountservice.external.model.ExternalWithdrawalTransaction;
import com.mosaic.accountservice.external.outbox.ExternalOutboxEvent;
import com.mosaic.accountservice.external.outbox.ExternalOutboxEventRepository;
import com.mosaic.accountservice.external.repository.ExternalWithdrawalRepository;
import com.mosaic.payload.AccountTransactionPayload;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class ExternalWithdrawalServiceImpl implements ExternalWithdrawalService {
	private final ExternalWithdrawalRepository externalWithdrawalRepository;
	private final ExternalOutboxEventRepository externalOutboxEventRepository;
	private final ObjectMapper objectMapper;

	@Override
	public void withdraw(BigDecimal amount, String accountNumber, String bankCode, Integer memberId) throws
		JsonProcessingException {

		log.info("외부 출금 요청 시작 - memberId={}, amount={}, accountNumber={}, bankCode={}",
			memberId, amount, accountNumber, bankCode);
		var externalWithdrawalTransaction = ExternalWithdrawalTransaction.builder()
			.accountId(memberId)
			.accountNumber(accountNumber)
			.bankCode(
				BankCode.fromCode(bankCode))
			.amount(amount)
			.build();

		var tx = externalWithdrawalRepository.save(externalWithdrawalTransaction);

		var payload = new AccountTransactionPayload(
			tx.getAccountId(),
			tx.getId(),
			tx.getAmount(),
			tx.getCreatedAt(),
			null
		);

		ExternalOutboxEvent event = ExternalOutboxEvent.builder()
			.topic("external.withdrawal.requested")
			.key(tx.getId().toString())
			.payload(objectMapper.writeValueAsString(payload))
			.build();

		externalOutboxEventRepository.save(event);
	}
}

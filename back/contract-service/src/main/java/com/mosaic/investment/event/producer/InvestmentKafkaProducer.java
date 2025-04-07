package com.mosaic.investment.event.producer;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosaic.payload.AccountTransactionPayload;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class InvestmentKafkaProducer {

	private static final String INVEST_DEPOSIT_REQUESTED = "investment.deposit.requested";
	private static final String INVEST_DEPOSIT_REJECTED = "investment.deposit.failed";

	private static final String INVEST_WITHDRAWAL_REQUESTED = "investment.withdrawal.requested";
	private static final String INVEST_WITHDRAWAL_REJECTED = "investment.withdrawal.rejected";

	private final KafkaTemplate<String, String> kafkaTemplate;
	private final ObjectMapper kafkaObjectMapper;

	public void sendInvestmentWithdrawalRequest(AccountTransactionPayload payload) throws JsonProcessingException {
		kafkaTemplate.send(INVEST_WITHDRAWAL_REQUESTED, kafkaObjectMapper.writeValueAsString((payload)));
	};
	public void sendInvestmentWithdrawalReject(AccountTransactionPayload payload) throws JsonProcessingException {
		kafkaTemplate.send(INVEST_DEPOSIT_REJECTED, kafkaObjectMapper.writeValueAsString((payload)));
	};

	public void sendInvestmentDepositRequest(AccountTransactionPayload payload) throws JsonProcessingException {
		kafkaTemplate.send(INVEST_DEPOSIT_REQUESTED, kafkaObjectMapper.writeValueAsString(payload));
	}

	public void sendInvestmentDepositReject(AccountTransactionPayload payload) throws JsonProcessingException {
		kafkaTemplate.send(INVEST_DEPOSIT_REJECTED, kafkaObjectMapper.writeValueAsString(payload));
	}
}

package com.mosaic.loan.event.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosaic.loan.service.LoanService;
import com.mosaic.payload.AccountTransactionPayload;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class LoanKafkaConsumer {
	private static final String LOAN_DEPOSIT_REQUEST = "loan.repay.requested";
	private static final String LOAN_DEPOSIT_COMPLETE = "loan.repay.completed";
	private static final String LOAN_DEPOSIT_REJECT = "loan.repay.rejected";
	private static final String LOAN_WITHDRAW_FAIL = "loan.withdraw.rejected";
	private final ObjectMapper objectMapper;

	private final LoanService loanService;

	@KafkaListener(topics = LOAN_DEPOSIT_COMPLETE, groupId = "loan.repay.request.consumer")
	public void repayLoanRequestedCompleted(@Payload String payload) throws Exception {
		AccountTransactionPayload accountTransactionComplete = objectMapper.readValue(payload,
			AccountTransactionPayload.class);
		//TODO 웹소켓을 통한 성공 메세지 전달
		loanService.completeLoanRepayRequest(accountTransactionComplete);
		log.info("{}의 대출 상환이 이루어집니다", accountTransactionComplete.accountId());
	}

	@KafkaListener(topics = LOAN_WITHDRAW_FAIL, groupId = "investment.withdraw.fail.consumer")
	public void rollbackDepositLoanRequested(@Payload String payload) throws JsonProcessingException {
		AccountTransactionPayload accountTransactionFail = objectMapper.readValue(payload,
			AccountTransactionPayload.class);
		loanService.rollbackLoanWithdrawal(accountTransactionFail);
		//TODO 웹소켓을 통한 실패 메세지 전달
		log.info("{}의 투자 계좌 생성이 실패했습니다", accountTransactionFail.accountId());
	}

	@KafkaListener(topics = LOAN_DEPOSIT_REJECT, groupId = "loan.repay.request.consumer")
	public void repayLoanRequestedFailed(@Payload String payload) throws Exception {
		AccountTransactionPayload accountTransactionFail = objectMapper.readValue(payload,
			AccountTransactionPayload.class);
		//TODO 웹소켓을 통한 성공 메세지 전달
		loanService.failLoanRepayRequest(accountTransactionFail);
		log.info("{}의 대출 상환이 실패했습니다", accountTransactionFail.accountId());
	}
}

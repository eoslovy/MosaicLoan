package com.mosaic.investment.event.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosaic.investment.service.InvestmentService;
import com.mosaic.loan.event.message.LoanCreateTransactionPayload;
import com.mosaic.payload.AccountTransactionPayload;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class InvestmentKafkaConsumer {
	private static final String INVEST_CREATE_COMPLETE = "investment.deposit.completed";
	private static final String INVEST_CREATE_REJECTED = "investment.deposit.rejected";
	//private static final String LOAN_EXECUTE_REQUEST = "loan.execute.request";
	private static final String LOAN_CREATE_EXECUTE = "loan.created.requested";

	private final InvestmentService investmentService;
	private final ObjectMapper objectMapper;

	@KafkaListener(topics = INVEST_CREATE_COMPLETE, groupId = "investment.deposit.completed.consumer")
	public void executeInvestmentRequested(@Payload String payload) throws Exception {
		AccountTransactionPayload accountTransactionComplete = objectMapper.readValue(payload,
			AccountTransactionPayload.class);
		//TODO 웹소켓을 통한 성공 메세지 전달
		investmentService.completeInvestmentRequest(accountTransactionComplete);
		log.info("[{}] {}의 투자 계좌 생성이 정상적으로 처리되었습니다", accountTransactionComplete.createdAt(),
			accountTransactionComplete.accountId());
	}

	@KafkaListener(topics = INVEST_CREATE_REJECTED, groupId = "investment.deposit.rejected.consumer")
	public void failMessageInvestmentRequested(@Payload String payload) throws JsonProcessingException {
		AccountTransactionPayload accountTransactionFail = objectMapper.readValue(payload,
			AccountTransactionPayload.class);
		//TODO 웹소켓을 통한 실패 메세지 전달
		log.info("[{}] {}의 투자 계좌 생성이 실패했습니다", accountTransactionFail.createdAt(), accountTransactionFail.accountId());
	}

	@KafkaListener(topics = LOAN_CREATE_EXECUTE, groupId = "investment.investor.consumer")
	public void executeInvestmentToLoan(@Payload String payload) throws Exception {
		LoanCreateTransactionPayload accountTransaction = objectMapper.readValue(payload,
			LoanCreateTransactionPayload.class);
		//TODO 웹소켓을 통한 투자 시작 메세지 전달
		log.info("[{}] {}의 {}상품 대출 {}% 적합자 검색이 시작되었습니다", accountTransaction.createdAt(), accountTransaction.loanId(),
			accountTransaction.interestRate(), accountTransaction.expectYield());
		investmentService.searchLoanAptInvestor(accountTransaction);
	}
}

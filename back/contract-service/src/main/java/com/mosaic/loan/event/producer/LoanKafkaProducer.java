package com.mosaic.loan.event.producer;

import java.util.function.Supplier;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosaic.loan.event.message.LoanCreateTransactionPayload;
import com.mosaic.payload.AccountTransactionPayload;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class LoanKafkaProducer {

    private static final String LOAN_CREATE = "loan.created.requested";
    private static final String LOAN_WITHDRAWAL_REQUEST = "loan.withdrawal.requested";
    private static final String LOAN_DEPOSIT_REQUEST = "loan.deposit.requested";
    private static final String LOAN_DEPOSIT_FAIL = "loan.deposit.failed";
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void sendLoanCreatedRequest(LoanCreateTransactionPayload payload) throws JsonProcessingException {
        log.info(objectMapper.writeValueAsString(payload));
        kafkaTemplate.send(LOAN_CREATE, objectMapper.writeValueAsString(payload));
    }

    public void sendLoanWithdrawalRequest(AccountTransactionPayload withdrawalEventPayload) throws JsonProcessingException {
        kafkaTemplate.send(LOAN_WITHDRAWAL_REQUEST, objectMapper.writeValueAsString(withdrawalEventPayload));
    }

    public void sendLoanRepayRequestEvent(AccountTransactionPayload repayEventPayload) throws JsonProcessingException {
        kafkaTemplate.send(LOAN_DEPOSIT_REQUEST, objectMapper.writeValueAsString(repayEventPayload));
    }

	public void sendLoanDepositFailEvent(AccountTransactionPayload accountTransactionComplete) throws
		JsonProcessingException {
	    kafkaTemplate.send(LOAN_DEPOSIT_FAIL, objectMapper.writeValueAsString(accountTransactionComplete));
    }
}

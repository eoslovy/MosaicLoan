package com.mosaic.loan.event.producer;

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

    private static final String INVEST_CREATE = "invest.created";
    private static final String LOAN_WITHDRAWAL_REQUEST = "loan.withdrawal.requested";
    private static final String LOAN_REPAY_REQUEST = "loan.repay.requested";
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public void sendLoanCreatedEvent(LoanCreateTransactionPayload payload) throws JsonProcessingException {
        kafkaTemplate.send(INVEST_CREATE, payload);
    }

    public void sendLoanWithdrawalEvent(AccountTransactionPayload withdrawalEventPayload) {
        kafkaTemplate.send(LOAN_WITHDRAWAL_REQUEST, withdrawalEventPayload);
    }

    public void sendLoanRepayRequestEvent(AccountTransactionPayload repayEventPayload) {
        kafkaTemplate.send(LOAN_REPAY_REQUEST, repayEventPayload);
    }
}

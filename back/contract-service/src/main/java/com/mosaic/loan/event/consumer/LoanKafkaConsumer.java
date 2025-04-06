package com.mosaic.loan.event.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosaic.loan.service.LoanService;
import com.mosaic.payload.AccountTransactionPayload;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class LoanKafkaConsumer {
    private static final String LOAN_REPAY_REQUEST = "loan.repay.requested";
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final ObjectMapper objectMapper;

    private final LoanService loanService;

    @KafkaListener(topics = LOAN_REPAY_REQUEST, groupId = "loan.repay.request.consumer")
    public void repayLoanRequested(@Payload String payload) throws Exception {
        AccountTransactionPayload accountTransactionComplete = objectMapper.readValue(payload,
                AccountTransactionPayload.class);
        //TODO 웹소켓을 통한 성공 메세지 전달
        loanService.completeLoanRepayRequest(accountTransactionComplete);
        log.info("{}의 대출 상환이 이루어집니다", accountTransactionComplete.accountId());
    }
}

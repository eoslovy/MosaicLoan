package com.mosaic.investment.event.producer;

import com.mosaic.investment.event.message.AccountTransactionPayload;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class InvestmentKafkaProducer {

    private static final String INVEST_CREATE = "investment.deposit.requested";
    private static final String INVEST_CONFIRM = "investment.deposit.failed";
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendInvestmentCreatedEvent(AccountTransactionPayload event) {
        kafkaTemplate.send(INVEST_CREATE, event);
    }

    public void sendInvestmentRollBackEvent(AccountTransactionPayload event) {
        kafkaTemplate.send(INVEST_CONFIRM, event);
    }
}

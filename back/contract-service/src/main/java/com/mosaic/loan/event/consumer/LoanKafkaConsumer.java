package com.mosaic.loan.event.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class LoanKafkaConsumer {
    private static final String INVEST_CREATE = "invest.created";
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    //public void handleInvestmentRequested(LoanCreatedEvent event) throws JsonProcessingException {
    //	kafkaTemplate.send(INVEST_CREATE, event.loanId(), event);
    //}
    //TODO 투자 신청한 이미지 메세지를 소비해서 활용

    //TODO
}

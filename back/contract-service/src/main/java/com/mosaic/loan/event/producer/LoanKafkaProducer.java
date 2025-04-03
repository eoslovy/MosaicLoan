package com.mosaic.loan.event.producer;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class LoanKafkaProducer {

    private static final String INVEST_CREATE = "invest.created";
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    //public void sendLoanCreatedEvent(LoanCreatedEvent event) throws JsonProcessingException {
    //	kafkaTemplate.send(INVEST_CREATE, event.loanId(), objectMapper.writeValueAsString(event));
    //}
}

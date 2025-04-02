package com.creditservice.health;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class KafkaConnectionVerifier implements ApplicationRunner {
    private final KafkaTemplate<String, String> kafkaTemplate;

    public KafkaConnectionVerifier(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }
    @Override
    public void run(ApplicationArguments args) {
        kafkaTemplate.send("test-topic", "ping");
        System.out.println("✅ Kafka test message sent");
    }
}

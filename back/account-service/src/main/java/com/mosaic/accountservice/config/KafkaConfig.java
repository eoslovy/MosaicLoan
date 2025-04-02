package com.mosaic.accountservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.util.backoff.FixedBackOff;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.accountservice.dto.KafkaEnvelope;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class KafkaConfig {

	@Bean
	public DefaultErrorHandler kafkaErrorHandler() {
		FixedBackOff backOff = new FixedBackOff(1000L, 2);

		DefaultErrorHandler errorHandler = new DefaultErrorHandler(
			(record, ex) -> {
				log.error("❌ Kafka message failed. Skipping. Record: {}, Error: {}", record, ex.getMessage(), ex);
			},
			backOff
		);

		errorHandler.addNotRetryableExceptions(JsonProcessingException.class);

		return errorHandler;
	}

	@Bean
	public ConcurrentKafkaListenerContainerFactory<String, KafkaEnvelope> kafkaListenerContainerFactory(
		ConsumerFactory<String, KafkaEnvelope> consumerFactory,
		DefaultErrorHandler errorHandler
	) {
		var factory = new ConcurrentKafkaListenerContainerFactory<String, KafkaEnvelope>();
		factory.setConsumerFactory(consumerFactory);
		factory.setCommonErrorHandler(errorHandler);
		return factory;
	}
}
package com.mosaic.core.config;

import java.util.HashMap;
import java.util.Map;

import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonSerializer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.mosaic.investment.event.message.AccountTransactionPayload;

@Configuration
public class KafkaConfig {

	@Bean
	public ObjectMapper kafkaObjectMapper() {
		return new ObjectMapper()
			.registerModule(new JavaTimeModule())
			.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
	}

	@Bean
	public KafkaTemplate<String, AccountTransactionPayload> kafkaTemplate(
		ProducerFactory<String, AccountTransactionPayload> producerFactory) {
		return new KafkaTemplate<>(producerFactory);
	}

	@Bean
	public ProducerFactory<String, AccountTransactionPayload> producerFactory(ObjectMapper objectMapper) {
		Map<String, Object> props = new HashMap<>();
		props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
		props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
		props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
		return new DefaultKafkaProducerFactory<>(props, new StringSerializer(), new JsonSerializer<>(objectMapper));
	}

	@Bean
	public JsonSerializer<Object> jsonSerializer(ObjectMapper kafkaObjectMapper) {
		return new JsonSerializer<>(kafkaObjectMapper);
	}
}

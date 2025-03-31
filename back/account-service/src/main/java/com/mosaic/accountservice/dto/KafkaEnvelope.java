package com.mosaic.accountservice.dto;

import com.fasterxml.jackson.databind.JsonNode;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PUBLIC)
public class KafkaEnvelope {
	private String eventType;
	private JsonNode payload;
}

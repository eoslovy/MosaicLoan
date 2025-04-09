package com.mydataservice.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
	// Kafka 관련 에러
	KAFKA_PUBLISH_ERROR("KAFKA_001", "Kafka 메시지 발행 중 오류가 발생했습니다."),

	// 데이터 처리 관련 에러
	PROCESSING_ERROR("DATA_001", "데이터 처리 중 오류가 발생했습니다."),

	BOT_TIMESTAMP("BOT_001", "현재 봇 타임 스탬프를 사용할 수 없습니다.");

	private final String code;
	private final String defaultMessage;
} 
package com.creditservice.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    // WebSocket 관련 에러
    WEBSOCKET_SEND_ERROR("WS_001", "WebSocket 메시지 전송 실패"),
    WEBSOCKET_SESSION_NOT_FOUND("WS_002", "WebSocket 세션을 찾을 수 없습니다."),
    INVALID_WEBSOCKET_URL("WS_003", "잘못된 WebSocket URL입니다."),
    
    // 데이터 처리 관련 에러
    DUPLICATE_MESSAGE("DATA_001", "중복된 메시지입니다."),
    INVALID_DATA("DATA_002", "잘못된 데이터 형식입니다."),
    PROCESSING_ERROR("DATA_003", "데이터 처리 중 오류가 발생했습니다."),

    // 모델링 서버 관련 에러
    MODELING_SERVER_ERROR("MODEL_001", "모델링 서버 호출 실패"),
    MODELING_RESPONSE_ERROR("MODEL_002", "모델링 서버 응답 실패"),
    MODELING_FEATURE_ERROR("MODEL_003", "모델링 feature 데이터 처리 실패"),

    // Kafka 관련 에러
    KAFKA_PUBLISH_ERROR("KAFKA_001", "Kafka 메시지 발행 실패"),
    NO_AVAILABLE_CASE("KAFKA_002", "사용 가능한 case_id가 없습니다"),

    // Redis 관련 에러
    REDIS_SAVE_ERROR("REDIS_001", "Redis 데이터 저장 실패"),
    REDIS_READ_ERROR("REDIS_002", "Redis 데이터 조회 실패"),
    REDIS_DELETE_ERROR("REDIS_003", "Redis 데이터 삭제 실패");

    private final String code;
    private final String defaultMessage;
} 
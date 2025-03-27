package com.mosaic.credit.evaluation.exception;

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
    PROCESSING_ERROR("DATA_003", "데이터 처리 중 오류가 발생했습니다.");

    private final String code;
    private final String defaultMessage;
} 
package com.mosaic.credit.evaluation.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosaic.credit.evaluation.exception.EvaluationException;
import com.mosaic.credit.evaluation.exception.ErrorCode;
import com.mosaic.credit.evaluation.websocket.CreditWebSocketHandler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebSocketService {
    private final CreditWebSocketHandler webSocketHandler;
    private final ObjectMapper objectMapper;

    public void sendResult(String caseId, Map<String, Object> payload) {
        try {
            String message = objectMapper.writeValueAsString(payload);
            webSocketHandler.sendMessage(caseId, message);
            log.info("WebSocket 메시지 전송 성공: caseId = {}", caseId);
        } catch (IOException e) {
            log.error("WebSocket 메시지 전송 실패: caseId = {}", caseId, e);
            throw new EvaluationException(ErrorCode.WEBSOCKET_SEND_ERROR);
        }
    }
} 
package com.mosaic.credit.evaluation.websocket;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class CreditWebSocketHandler extends TextWebSocketHandler {

    private final Map<String, WebSocketSession> sessionMap = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String caseId = WebSocketUrlParser.getCaseId(session);
        sessionMap.put(caseId, session);
        log.info("WebSocket 연결됨: caseId = {}", caseId);
    }

    public void sendMessage(String caseId, String message) {
        WebSocketSession session = sessionMap.get(caseId);
        if (session != null && session.isOpen()) {
            try {
                session.sendMessage(new TextMessage(message));
            } catch (Exception e) {
                log.error("WebSocket 메시지 전송 실패: caseId = {}", caseId, e);
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String caseId = WebSocketUrlParser.getCaseId(session);
        sessionMap.remove(caseId);
        log.info("WebSocket 연결 종료: caseId = {}", caseId);
    }
} 
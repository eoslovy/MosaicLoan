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

    private final Map<Integer, WebSocketSession> sessionMap = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        Integer memberId = WebSocketUrlParser.getMemberId(session);
        sessionMap.put(memberId, session);
        log.info("WebSocket 연결됨: memberId = {}", memberId);
    }

    public void sendMessage(Integer memberId, String message) {
        WebSocketSession session = sessionMap.get(memberId);
        if (session != null && session.isOpen()) {
            try {
                session.sendMessage(new TextMessage(message));
            } catch (Exception e) {
                log.error("WebSocket 메시지 전송 실패: memberId = {}", memberId, e);
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        Integer memberId = WebSocketUrlParser.getMemberId(session);
        sessionMap.remove(memberId);
        log.info("WebSocket 연결 종료: memberId = {}", memberId);
    }
} 
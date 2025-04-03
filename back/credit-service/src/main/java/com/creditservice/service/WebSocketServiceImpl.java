package com.creditservice.service;

import org.springframework.stereotype.Service;

import com.creditservice.websocket.CreditWebSocketHandler;
import com.creditservice.exception.WebSocketException;
import com.creditservice.exception.ErrorCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebSocketServiceImpl implements WebSocketService {
    private final CreditWebSocketHandler webSocketHandler;

    public void sendEvaluationComplete(Integer memberId) {
        try {
            webSocketHandler.sendMessage(memberId, "신용평가가 완료되었습니다!");
        } catch (Exception e) {
            throw new WebSocketException(ErrorCode.WEBSOCKET_SEND_ERROR, "평가 완료 알림 전송 실패: memberId = " + memberId);
        }
    }
} 
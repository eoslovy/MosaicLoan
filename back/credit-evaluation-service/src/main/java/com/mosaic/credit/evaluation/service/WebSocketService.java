package com.mosaic.credit.evaluation.service;

import org.springframework.stereotype.Service;

import com.mosaic.credit.evaluation.websocket.CreditWebSocketHandler;
import com.mosaic.credit.evaluation.exception.WebSocketException;
import com.mosaic.credit.evaluation.exception.ErrorCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebSocketService {
    private final CreditWebSocketHandler webSocketHandler;

    public void sendEvaluationComplete(Integer memberId) {
        try {
            webSocketHandler.sendMessage(memberId, "신용평가가 완료되었습니다!");
        } catch (Exception e) {
            throw new WebSocketException(ErrorCode.WEBSOCKET_SEND_ERROR, "평가 완료 알림 전송 실패: memberId = " + memberId);
        }
    }
} 
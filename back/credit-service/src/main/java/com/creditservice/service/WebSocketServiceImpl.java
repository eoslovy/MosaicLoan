package com.creditservice.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.creditservice.exception.ErrorCode;
import com.creditservice.exception.WebSocketException;
import com.creditservice.websocket.CreditWebSocketHandler;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebSocketServiceImpl implements WebSocketService {
	private final CreditWebSocketHandler webSocketHandler;
	private final ObjectMapper objectMapper = new ObjectMapper();

	public void sendEvaluationComplete(Integer memberId) throws JsonProcessingException {
		try {
			Map<String, Object> message = new HashMap<>();
			message.put("status", "completed");
			message.put("message", "신용평가가 완료되었습니다!");
			String data = objectMapper.writeValueAsString(message);
			webSocketHandler.sendMessage(memberId, data);
		} catch (Exception e) {
			Map<String, Object> message = new HashMap<>();
			message.put("status", "failed");
			message.put("message", "신용평가가 실패하였습니다!");
			String data = objectMapper.writeValueAsString(message);
			webSocketHandler.sendMessage(memberId, data);
			throw new WebSocketException(ErrorCode.WEBSOCKET_SEND_ERROR, "평가 완료 알림 전송 실패: memberId = " + memberId);
		}
	}
} 
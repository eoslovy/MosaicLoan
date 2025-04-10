package com.creditservice.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.creditservice.domain.EvaluationStatus;
import com.creditservice.exception.ErrorCode;
import com.creditservice.exception.WebSocketException;
import com.creditservice.websocket.CreditWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebSocketServiceImpl implements WebSocketService {

	private final CreditWebSocketHandler webSocketHandler;
	private final ObjectMapper objectMapper = new ObjectMapper();

	public void sendEvaluationComplete(Integer memberId, EvaluationStatus status) {
		String statusValue;
		String messageValue;

		if (status == EvaluationStatus.APPROVED) {
			statusValue = "completed";
			messageValue = "신용평가가 완료되었습니다!";
		} else {
			statusValue = "failed";
			messageValue = "신용평가가 실패하였습니다!";
		}

		Map<String, Object> message = Map.of(
			"status", statusValue,
			"message", messageValue
		);

		try {
			String data = objectMapper.writeValueAsString(message);
			webSocketHandler.sendMessage(memberId, data);
		} catch (Exception e) {
			log.error("웹소켓 전송 실패: memberId = {}, status = {}", memberId, status, e);
			throw new WebSocketException(ErrorCode.WEBSOCKET_SEND_ERROR, "평가 완료 알림 전송 실패: memberId = " + memberId);
		}
	}
}

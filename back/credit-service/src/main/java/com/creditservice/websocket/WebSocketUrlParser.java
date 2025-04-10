package com.creditservice.websocket;

import org.springframework.web.socket.WebSocketSession;

import com.creditservice.exception.ErrorCode;
import com.creditservice.exception.EvaluationException;

public class WebSocketUrlParser {
	// WebSocket 연결이 처음 맺어질 때 URL에서 memberId를 추출
	public static Integer getMemberId(WebSocketSession session) {
		String uri = session.getUri().toString();
		String[] parts = uri.split("\\?");
		if (parts.length < 2) {
			throw new EvaluationException(ErrorCode.INVALID_WEBSOCKET_URL);
		}

		String[] params = parts[1].split("&");
		for (String param : params) {
			if (param.startsWith(WebSocketConstants.MEMBER_ID_PARAM + "=")) {
				return Integer.valueOf(param.split("=")[1]);
			}
		}

		throw new EvaluationException(ErrorCode.INVALID_WEBSOCKET_URL);
	}
} 
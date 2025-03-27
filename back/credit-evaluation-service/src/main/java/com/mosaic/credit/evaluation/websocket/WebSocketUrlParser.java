package com.mosaic.credit.evaluation.websocket;

import org.springframework.web.socket.WebSocketSession;

import com.mosaic.credit.evaluation.exception.EvaluationException;
import com.mosaic.credit.evaluation.exception.ErrorCode;

public class WebSocketUrlParser {
    public static String getCaseId(WebSocketSession session) {
        String uri = session.getUri().toString();
        String[] parts = uri.split("\\?");
        if (parts.length < 2) {
            throw new EvaluationException(ErrorCode.INVALID_WEBSOCKET_URL);
        }

        String[] params = parts[1].split("&");
        for (String param : params) {
            if (param.startsWith(WebSocketConstants.CASE_ID_PARAM + "=")) {
                return param.split("=")[1];
            }
        }

        throw new EvaluationException(ErrorCode.INVALID_WEBSOCKET_URL);
    }
} 
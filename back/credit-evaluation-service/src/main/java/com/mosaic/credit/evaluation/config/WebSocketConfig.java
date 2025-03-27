package com.mosaic.credit.evaluation.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import com.mosaic.credit.evaluation.websocket.WebSocketConstants;
import com.mosaic.credit.evaluation.websocket.CreditWebSocketHandler;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {

	private final CreditWebSocketHandler creditWebSocketHandler;

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(creditWebSocketHandler, WebSocketConstants.WEBSOCKET_PATH)
			.setAllowedOrigins(WebSocketConstants.ALLOWED_ORIGINS);
	}
}

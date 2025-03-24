package com.mosaic.auth.config;

import java.io.IOException;
import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosaic.auth.dto.ErrorResponse;
import com.mosaic.auth.exception.ErrorCode;
import com.mosaic.auth.jwt.JwtAuthenticationFilter;
import com.mosaic.auth.jwt.JwtProvider;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

	private final JwtProvider jwtProvider;
	private final ObjectMapper objectMapper;

	private void sendErrorResponse(HttpServletRequest request, HttpServletResponse response, HttpStatus status,
		String message, ErrorCode code) throws IOException {
		response.setContentType("application/json;charset=UTF-8");
		response.setStatus(status.value());
		ErrorResponse errorResponse = ErrorResponse.builder()
			.code(code)
			.message(message)
			.build();

		objectMapper.writeValue(response.getWriter(), errorResponse);
	}

	void handleUnauthorized(HttpServletRequest request, HttpServletResponse response,
		AuthenticationException authException) throws IOException {
		log.info(authException.getMessage(), authException);
		sendErrorResponse(request, response, HttpStatus.UNAUTHORIZED, "인증이 필요한 요청입니다.", ErrorCode.UNAUTHORIZED);
	}

	void handleAccessDenied(HttpServletRequest request, HttpServletResponse response,
		AccessDeniedException accessDeniedException) throws IOException {
		log.info(accessDeniedException.getMessage(), accessDeniedException);
		sendErrorResponse(request, response, HttpStatus.FORBIDDEN, "해당 리소스에 대한 접근 권한이 없습니다.", ErrorCode.ACCESS_DENIED);
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		return http
			.cors(cors -> cors.configurationSource(corsConfigurationSource()))
			.csrf(csrf -> csrf.disable())
			.formLogin(login -> login.disable())
			.httpBasic(basic -> basic.disable())
			.logout(logout -> logout.disable())
			.authorizeHttpRequests(auth -> auth
				.requestMatchers(
					"/auth/kakao/login",     // 카카오 로그인 URL
					"/auth/kakao/callback"   // 카카오 콜백 URL
				).permitAll()
				.anyRequest().authenticated() // 나머지 모든 요청은 인증 필요
			)
			.exceptionHandling(ex -> ex
				.authenticationEntryPoint((request, response, authException) -> {
					handleUnauthorized(request, response, authException);
				})
				.accessDeniedHandler((request, response, accessDeniedException) -> {
					handleAccessDenied(request, response, accessDeniedException);
				})
			)
			.addFilterBefore(new JwtAuthenticationFilter(jwtProvider), UsernamePasswordAuthenticationFilter.class)
			.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(Arrays.asList("*"));
		configuration.setAllowCredentials(true); // 쿠키 허용

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
}

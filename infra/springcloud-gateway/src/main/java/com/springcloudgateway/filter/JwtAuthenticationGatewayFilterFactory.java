package com.springcloudgateway.filter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;

import com.springcloudgateway.dto.MemberInfoResponse;

import reactor.core.publisher.Mono;

@Component("jwt-authentication")
public class JwtAuthenticationGatewayFilterFactory
	extends AbstractGatewayFilterFactory<JwtAuthenticationGatewayFilterFactory.Config> {

	private static final String MEMBER_ID_HEADER = "X-MEMBER-ID";
	private static final String IS_BOT_HEADER = "X-IS-BOT";
	private static final String ACCESS_TOKEN_COOKIE_NAME = "access-token";

	private final WebClient webClient;
	// private final SecretKey key;

	public JwtAuthenticationGatewayFilterFactory(
		@Value("${jwt.secret}") String secret,
		WebClient.Builder webClientBuilder
	) {
		super(Config.class);
		// this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
		this.webClient = webClientBuilder.build();
	}

	@Override
	public GatewayFilter apply(Config config) {
		return (exchange, chain) -> {
			var cookie = exchange.getRequest()
				.getCookies()
				.getFirst(ACCESS_TOKEN_COOKIE_NAME);

			if (cookie == null) {
				return unauthorized(exchange);
			}

			// try {
			// Claims claims = validateToken(cookie.getValue());
			// 이거 뽑아내는 로직이 memberService랑 달랐음
			// Integer memberId = claims.get("memberId", Integer.class);
			// Integer memberId = Integer.valueOf(claims.getSubject());

			return fetchMemberInfo(cookie)
				.flatMap(member -> {
					boolean isBot = "BOT".equals(member.getOauthProvider());

					// 요청 헤더에 사용자 정보 추가
					ServerHttpRequest mutatedRequest = exchange.getRequest()
						.mutate()
						.header(MEMBER_ID_HEADER, String.valueOf(member.getId()))
						.header(IS_BOT_HEADER, String.valueOf(isBot))
						.build();

					ServerWebExchange mutatedExchange = exchange.mutate()
						.request(mutatedRequest)
						.build();

					return chain.filter(mutatedExchange);
				})
				.onErrorResume(e -> unauthorized(exchange));

			// } catch (ExpiredJwtException | MalformedJwtException | SignatureException e) {
			// 	return unauthorized(exchange);
			// }
		};
	}

	private Mono<Void> unauthorized(ServerWebExchange exchange) {
		exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
		return exchange.getResponse().setComplete();
	}

	// private Claims validateToken(String token) {
	// 	return Jwts.parserBuilder()
	// 		.setSigningKey(key)
	// 		.build()
	// 		.parseClaimsJws(token)
	// 		.getBody();
	// }

	private Mono<MemberInfoResponse> fetchMemberInfo(HttpCookie accessTokenCookie) {
		return webClient.get()
			.uri("http://member-api:8080/auth/internal/verify-token")
			.header("X-INTERNAL-CALL", "true")
			.cookies(cookies -> {
				cookies.add(accessTokenCookie.getName(), accessTokenCookie.getValue());
			})
			.retrieve()
			.bodyToMono(MemberInfoResponse.class);
	}

	public static class Config {
		// 필요한 설정 프로퍼티를 여기에 추가
	}
} 
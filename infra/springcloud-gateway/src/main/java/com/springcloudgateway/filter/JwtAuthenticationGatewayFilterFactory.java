package com.springcloudgateway.filter;

import java.nio.charset.StandardCharsets;
import java.util.List;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.server.authentication.ServerAuthenticationConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;

import com.springcloudgateway.dto.MemberInfoResponse;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import reactor.core.publisher.Mono;

@Component("jwt-authentication")
public class JwtAuthenticationGatewayFilterFactory extends AbstractGatewayFilterFactory<JwtAuthenticationGatewayFilterFactory.Config> 
    implements ServerAuthenticationConverter {

    private static final String MEMBER_ID_HEADER = "X-Member-Id";
    private static final String IS_BOT_HEADER = "X-Is-Bot";
    private static final String ACCESS_TOKEN_COOKIE_NAME = "access-token";

    private final WebClient webClient;
    private final SecretKey key;

    public JwtAuthenticationGatewayFilterFactory(
        @Value("${jwt.secret}") String secret,
        WebClient.Builder webClientBuilder
    ) {
        super(Config.class);
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.webClient = webClientBuilder.build();
    }

    @Override
    public Mono<Authentication> convert(ServerWebExchange exchange) {
        var cookie = exchange.getRequest()
            .getCookies()
            .getFirst(ACCESS_TOKEN_COOKIE_NAME);

        if (cookie == null) {
            return Mono.empty();
        }

        try {
            Claims claims = validateToken(cookie.getValue());
            Integer memberId = claims.get("memberId", Integer.class);

            return fetchMemberInfo(memberId)
                .map(member -> {
                    boolean isBot = "BOT".equals(member.getOauthProvider());
                    
                    // 헤더 추가
                    ServerHttpRequest mutatedRequest = exchange.getRequest()
                        .mutate()
                        .header(MEMBER_ID_HEADER, String.valueOf(memberId))
                        .header(IS_BOT_HEADER, String.valueOf(isBot))
                        .build();

                    // Spring Security 인증 객체 생성
                    return new UsernamePasswordAuthenticationToken(
                        memberId,
                        null,
                        isBot ? List.of(new SimpleGrantedAuthority("ROLE_BOT")) 
                             : List.of(new SimpleGrantedAuthority("ROLE_USER"))
                    );
                });
        } catch (ExpiredJwtException | MalformedJwtException | SignatureException e) {
            return Mono.empty();
        }
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            var cookie = exchange.getRequest()
                .getCookies()
                .getFirst(ACCESS_TOKEN_COOKIE_NAME);

            if (cookie == null) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            try {
                Claims claims = validateToken(cookie.getValue());
                Integer memberId = claims.get("memberId", Integer.class);

                return fetchMemberInfo(memberId)
                    .flatMap(member -> {
                        boolean isBot = "BOT".equals(member.getOauthProvider());
                        
                        // 헤더 추가
                        ServerHttpRequest mutatedRequest = exchange.getRequest()
                            .mutate()
                            .header(MEMBER_ID_HEADER, String.valueOf(memberId))
                            .header(IS_BOT_HEADER, String.valueOf(isBot))
                            .build();

                        // Spring Security 인증 객체 생성
                        Authentication authentication = new UsernamePasswordAuthenticationToken(
                            memberId,
                            null,
                            isBot ? List.of(new SimpleGrantedAuthority("ROLE_BOT")) 
                                 : List.of(new SimpleGrantedAuthority("ROLE_USER"))
                        );

                        // 인증 객체를 exchange에 저장
                        exchange.getAttributes().put("AUTHENTICATION", authentication);

                        return chain.filter(exchange.mutate().request(mutatedRequest).build());
                    })
                    .onErrorResume(e -> {
                        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                        return exchange.getResponse().setComplete();
                    });

            } catch (ExpiredJwtException | MalformedJwtException | SignatureException e) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }
        };
    }

    private Claims validateToken(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody();
    }

    private Mono<MemberInfoResponse> fetchMemberInfo(Integer memberId) {
        return webClient.get()
            .uri("http://member-api:8080/test/member/{memberId}", memberId)
            .retrieve()
            .bodyToMono(MemberInfoResponse.class);
    }

    public static class Config {
        // 필요한 설정 프로퍼티를 여기에 추가
    }
} 
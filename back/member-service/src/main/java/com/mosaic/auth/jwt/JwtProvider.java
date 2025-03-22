package com.mosaic.auth.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.Duration;
import java.util.Date;

@Component
public class JwtProvider {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.access-expiration}")
    private long accessTokenValidity;

    @Value("${jwt.refresh-expiration}")
    private long refreshTokenValidity;

    private Key key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String createAccessToken(Long memberId, String name) {
        return createToken(memberId, name, accessTokenValidity);
    }

    public String createRefreshToken(Long memberId, String name) {
        return createToken(memberId, name, refreshTokenValidity);
    }

    private String createToken(Long memberId, String name, long validity) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + validity);

        Claims claims = Jwts.claims().setSubject(String.valueOf(memberId));
        claims.put("name", name);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public Long getMemberIdFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return Long.valueOf(claims.getSubject());
    }

    public Date getExpiration(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
    }

    private final StringRedisTemplate redisTemplate;

    public JwtProvider(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    // Redis에 memberId를 키로, refreshToken을 값으로 저장
    // 만료 시간은 refreshToken의 유효기간만큼
    public void saveRefreshToken(Long memberId, String refreshToken) {
        redisTemplate.opsForValue().set(
                "refresh:" + memberId,
                refreshToken,
                Duration.ofMillis(refreshTokenValidity)
        );
    }

    // 로그아웃 시 엑세스 토큰 블랙리스트 등록
    public void blacklistToken(String token, long expirationMillis) {
        redisTemplate.opsForValue().set(
                "blacklist:" + token,
                "logout",
                Duration.ofMillis(expirationMillis)
        );
    }

    // 블랙리스트 확인
    public boolean isBlacklisted(String token) {
        return redisTemplate.hasKey("blacklist:" + token);
    }

    public long getAccessTokenValidity() {
        return accessTokenValidity;
    }

    public long getRefreshTokenValidity() {
        return refreshTokenValidity;
    }

    // Redis에서 리프레시 토큰 조회
    public String getRefreshToken(Long memberId) {
        return redisTemplate.opsForValue().get("refresh:" + memberId);
    }

    public String getNameFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.get("name", String.class);
    }
}

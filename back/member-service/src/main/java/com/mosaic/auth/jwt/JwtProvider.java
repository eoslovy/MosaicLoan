package com.mosaic.auth.jwt;

import java.security.Key;
import java.time.Duration;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

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

	public String createAccessToken(Integer memberId) {
		return createToken(memberId, accessTokenValidity);
	}

	public String createRefreshToken(Integer memberId) {
		return createToken(memberId, refreshTokenValidity);
	}

	private String createToken(Integer memberId, long validity) {
		Date now = new Date();
		Date expiry = new Date(now.getTime() + validity);

		return Jwts.builder()
			.setSubject(String.valueOf(memberId))
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

	public Integer getMemberIdFromToken(String token) {
		Claims claims = Jwts.parserBuilder()
			.setSigningKey(key)
			.build()
			.parseClaimsJws(token)
			.getBody();
		return Integer.valueOf(claims.getSubject());
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

	// Redis에 memberId를 키로, accessToken을 값으로 저장
	public void saveAccessToken(Integer memberId, String accessToken) {
		redisTemplate.opsForValue().set(
			"access:" + memberId,
			accessToken,
			Duration.ofMillis(accessTokenValidity)
		);
	}

	// Redis에서 memberId로 accessToken 조회
	public String getAccessToken(Integer memberId) {
		return redisTemplate.opsForValue().get("access:" + memberId);
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

	// Redis에서 memberId로 accessToken 삭제
	public void deleteAccessToken(Integer memberId) {
		redisTemplate.delete("access:" + memberId);
	}
}

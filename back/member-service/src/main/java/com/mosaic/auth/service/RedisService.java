package com.mosaic.auth.service;

public interface RedisService {

	void saveAccessToken(Integer memberId, String accessToken, long validityMillis);

	String getAccessToken(Integer memberId);

	void deleteAccessToken(Integer memberId);

	void addToBlacklist(String token, long expirationMillis);

	boolean isBlacklisted(String token);
} 
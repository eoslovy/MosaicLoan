package com.creditservice.health;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class RedisConnectionVerifier implements ApplicationRunner {

	private final RedisTemplate<String, String> redisTemplate;

	public RedisConnectionVerifier(RedisTemplate<String, String> redisTemplate) {
		this.redisTemplate = redisTemplate;
	}

	@Override
	public void run(ApplicationArguments args) {
		redisTemplate.opsForValue().set("ping", "pong");
		String result = redisTemplate.opsForValue().get("ping");
		System.out.println("✅ Redis test result: " + result);
	}
}

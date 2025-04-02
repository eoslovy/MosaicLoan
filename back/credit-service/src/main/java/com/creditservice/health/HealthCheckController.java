package com.creditservice.health;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/health")
public class HealthCheckController {

    @Autowired private DataSource dataSource;
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    @Autowired private KafkaTemplate<String, String> kafkaTemplate;

    @GetMapping
    public ResponseEntity<?> checkAll() {
        Map<String, Object> status = new HashMap<>();

        // DB 확인
        try (Connection conn = dataSource.getConnection()) {
            status.put("mysql", conn.isValid(1) ? "OK" : "FAIL");
        } catch (Exception e) {
            status.put("mysql", "FAIL: " + e.getMessage());
        }

        // Redis 확인
        try {
            redisTemplate.opsForValue().set("ping", "pong");
            String result = redisTemplate.opsForValue().get("ping");
            status.put("redis", "pong".equals(result) ? "OK" : "FAIL");
        } catch (Exception e) {
            status.put("redis", "FAIL: " + e.getMessage());
        }

        // Kafka 확인
        try {
            kafkaTemplate.send("test-topic", "health-check");
            status.put("kafka", "OK");
        } catch (Exception e) {
            status.put("kafka", "FAIL: " + e.getMessage());
        }

        return ResponseEntity.ok(status);
    }
}

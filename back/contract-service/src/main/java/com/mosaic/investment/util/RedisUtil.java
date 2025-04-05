package com.mosaic.investment.util;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RedisUtil {
    //public final RedisTemplate<String, Integer> redisIdempotenceTemplate;
    private final static String IDEMPOTENT_KEY = "INVESTMENT_REQUEST";

    public Boolean handleRequestInvestmentIdempotency(Integer IdempotencyKey) {
        //redisIdempotenceTemplate.opsForZSet().;

        return Boolean.TRUE;
    }

}

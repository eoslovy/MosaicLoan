package com.mosaic.credit.evaluation.repository.redis;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class RedisKeyGenerator {
    private static final String KEY_PREFIX = "evaluation:";
    private static final String RECEIVED_SUFFIX = ":received";
    private static final String PAYLOAD_SUFFIX = ":payload";
    private static final String TIMESTAMP_SUFFIX = ":timestamp";

    public static String getReceivedKey(String caseId) {
        return KEY_PREFIX + caseId + RECEIVED_SUFFIX;
    }

    public static String getPayloadKey(String caseId, String source) {
        return KEY_PREFIX + caseId + PAYLOAD_SUFFIX + ":" + source;
    }

    public static String getTimestampKey(String caseId) {
        return KEY_PREFIX + caseId + TIMESTAMP_SUFFIX;
    }
} 
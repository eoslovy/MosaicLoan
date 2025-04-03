package com.mosaic.core.util;

import lombok.Getter;
import org.springframework.http.HttpMethod;

@Getter
public enum InternalApiTarget {

    MEMBER("http://member-api:8080"),
    ACCOUNT("http://account-api:8080"),
    CONTRACT("http://contract-api:8080"),
    CREDIT("http://credit-api:8080"),
    MYDATA("http://mydata-api:8080");

    private final String baseUrl;

    InternalApiTarget(String baseUrl) {
        this.baseUrl = baseUrl;
    }

}

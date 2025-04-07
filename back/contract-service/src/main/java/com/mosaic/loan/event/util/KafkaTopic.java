package com.mosaic.loan.event.util;

public enum KafkaTopic {
    INVESTMENT_CREATED("invest.created"),
    INVESTMENT_PAID("invest.paid"),
    CONTRACT_APPROVED("contract.approved"),
    LOAN_CREATED("loan.created");

    private final String topic;

    KafkaTopic(String topic) {
        this.topic = topic;
    }

    public String value() {
        return topic;
    }
}
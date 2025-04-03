package com.mydataservice.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum DataSource {
    CREDIT("credit", "credit-consumer", "SELECT * FROM credit_history WHERE case_id = ?"),
    BEHAVIOR("behavior", "behavior-consumer", "SELECT * FROM behavior_analysis WHERE case_id = ?"),
    DEMOGRAPHIC("demographic", "demographic-consumer", "SELECT * FROM demographics WHERE case_id = ?"),
    TIMESERIES("timeseries", "timeseries-consumer", "SELECT * FROM timeseries_features WHERE case_id = ?");

    private final String source;
    private final String groupId;
    private final String query;
}
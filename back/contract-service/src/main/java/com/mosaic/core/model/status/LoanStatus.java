package com.mosaic.core.model.status;

public enum LoanStatus {
    PENDING,
    IN_PROGRESS,             // 진행 중
    COMPLETED,               // 완료
    PARTIALLY_DELINQUENT,    // 일부 연체
    DELINQUENT               // 연체
}

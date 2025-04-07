package com.mosaic.accountservice.external.dto;

import java.math.BigDecimal;

public record ExternalWithdrawalRequest(BigDecimal amount, String accountNumber, String bankCode) {

}

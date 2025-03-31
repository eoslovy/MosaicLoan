package com.mosaic.accountservice.event.model;

import java.time.LocalDateTime;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PUBLIC)
public final class AccountCreateRequestedPayload {
	private Integer memberId;
	private LocalDateTime requestedAt;
}

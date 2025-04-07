package com.mosaic.auth.dto;

import java.time.LocalDateTime;

import com.mosaic.auth.domain.Member;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class MemberInfoResponse {
	private final Integer id;
	private final String name;
	private final String oauthProvider;
	private final LocalDateTime createdAt;

	public static MemberInfoResponse from(Member member) {
		return builder()
			.id(member.getId())
			.name(member.getName())
			.oauthProvider(member.getOauthProvider())
			.createdAt(member.getCreatedAt())
			.build();
	}
} 
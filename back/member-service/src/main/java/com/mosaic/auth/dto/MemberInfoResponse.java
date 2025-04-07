package com.mosaic.auth.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import com.mosaic.auth.domain.Member;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class MemberInfoResponse {
    private final Integer id;
    private final String name;
    private final String oauthProvider;

    public static MemberInfoResponse from(Member member) {
        return builder()
            .id(member.getId())
            .name(member.getName())
            .oauthProvider(member.getOauthProvider())
            .build();
    }
} 
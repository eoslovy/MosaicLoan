// package com.mosaic.auth.dto;
//
// import lombok.AccessLevel;
// import lombok.AllArgsConstructor;
// import lombok.Builder;
// import lombok.Getter;
//
// @Getter
// @Builder
// @AllArgsConstructor(access = AccessLevel.PRIVATE)
// public class MemberResponse {
// 	private final Integer id;
// 	private final String name;
// 	private final String oauthProvider;
//
// 	// public static MemberResponse from(MemberPrincipal member) {
// 	// 	return builder()
// 	// 		.id(member.getId())
// 	// 		.name(member.getName())
// 	// 		.oauthProvider(member.getOauthProvider())
// 	// 		.build();
// 	// }
//
// 	public static MemberResponse from(Integer memberId) {
// 		return builder()
// 			.id(memberId)
// 			.name("홍길동")
// 			.oauthProvider("BOT")
// 			.build();
// 	}
// }
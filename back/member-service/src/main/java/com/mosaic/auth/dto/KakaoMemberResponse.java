package com.mosaic.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class KakaoMemberResponse {
	private Long id;
	private Properties properties;

	@Getter
	@NoArgsConstructor
	public static class Properties {
		private String nickname;
	}

	public String getNickname() {
		return properties != null && properties.nickname != null
			? properties.nickname
			: "카카오_" + id;
	}
}

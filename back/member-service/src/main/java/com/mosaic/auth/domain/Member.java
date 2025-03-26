package com.mosaic.auth.domain;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "member")
public class Member {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "oauth_id", unique = true, nullable = false)
	private String oauthId;

	@Column(name = "name")
	private String name;

	@Column(name = "oauth_provider")
	private String oauthProvider = "KAKAO";

	@CreationTimestamp
	@Column(name = "created_at", updatable = false)
	private LocalDateTime createdAt;

	public Member(String oauthId, String name) {
		this.oauthId = oauthId;
		this.name = name;
	}

	public static Member createMember(String oauthId, String name) {
		return new Member(oauthId, name);
	}
}

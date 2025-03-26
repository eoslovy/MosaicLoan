package com.mosaic.auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mosaic.auth.domain.Member;

public interface MemberRepository extends JpaRepository<Member, Integer> {
	Optional<Member> findByOauthId(String oauthId);
}

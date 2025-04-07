package com.mosaic.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.mosaic.auth.dto.MemberInfoResponse;
import com.mosaic.auth.jwt.JwtProvider;
import com.mosaic.auth.service.MemberService;
import com.mosaic.auth.util.CookieUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class MemberController {

	private final MemberService memberService;
	private final JwtProvider jwtProvider;

	@GetMapping("/me")
	public ResponseEntity<MemberInfoResponse> me(@RequestHeader("X-MEMBER-ID") Integer memberId) {
		// return ResponseEntity.ok(MemberResponse.from(member));
		return ResponseEntity.ok(memberService.getMemberInfo(memberId));
	}

	@PostMapping("/logout")
	public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
		String accessToken = CookieUtil.getCookieValue(request, "access-token");
		memberService.logout(response, accessToken);
		CookieUtil.deleteCookie(response, accessToken);
		return ResponseEntity.ok().build();
	}

	@GetMapping("/auth/internal/verify-token")
	public ResponseEntity<MemberInfoResponse> verifyToken(
		@RequestHeader(value = "X-INTERNAL-CALL", required = false) Boolean isInternal,
		HttpServletRequest request) {
		if (!Boolean.TRUE.equals(isInternal)) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "잘못된 호출입니다.");
		}
		String accessToken = CookieUtil.getCookieValue(request, "access-token");
		Integer memberId = jwtProvider.getMemberIdFromToken(accessToken);
		return ResponseEntity.ok(memberService.getMemberInfo(memberId));
	}
}

package com.mosaic.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mosaic.auth.dto.MemberPrincipal;
import com.mosaic.auth.dto.MemberResponse;
import com.mosaic.auth.dto.MemberInfoResponse;
import com.mosaic.auth.service.MemberService;
import com.mosaic.auth.util.CookieUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class MemberController {

	private final MemberService memberService;

	@GetMapping("/me")
	public ResponseEntity<MemberResponse> me(@AuthenticationPrincipal MemberPrincipal member) {
		return ResponseEntity.ok(MemberResponse.from(member));
	}

	@PostMapping("/logout")
	public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
		String accessToken = CookieUtil.getCookieValue(request, "access-token");
		memberService.logout(response, accessToken);
		CookieUtil.deleteCookie(response, accessToken);
		return ResponseEntity.ok().build();
	}

	@GetMapping("/{memberId}")
	public ResponseEntity<MemberInfoResponse> getMemberInfo(@PathVariable Integer memberId) {
		return ResponseEntity.ok(memberService.getMemberInfo(memberId));
	}
}

package com.mosaic.auth.controller;

import com.mosaic.auth.model.ApiResponse;
import com.mosaic.auth.model.MemberPrincipal;
import com.mosaic.auth.service.MemberService;
import com.mosaic.auth.util.CookieUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<?>> me(@AuthenticationPrincipal MemberPrincipal user) {
        if (user == null) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("로그인되지 않았습니다."));
        }

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("username", user.getUsername());
        
        return ResponseEntity.ok(ApiResponse.success(userData));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<?>> logout(HttpServletRequest request, HttpServletResponse response) {
        String accessToken = CookieUtil.getCookieValue(request, "access-token");
        
        if (accessToken == null) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("로그아웃 실패: 토큰이 없습니다."));
        }

        boolean success = memberService.logout(response, accessToken);
        
        if (success) {
            return ResponseEntity.ok(ApiResponse.success("로그아웃 완료", null));
        } else {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("로그아웃 실패: 유효하지 않거나 이미 로그아웃된 토큰입니다."));
        }
    }
}

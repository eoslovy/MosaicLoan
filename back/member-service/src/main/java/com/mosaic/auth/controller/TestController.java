package com.mosaic.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import com.mosaic.auth.domain.Member;
import com.mosaic.auth.dto.MemberInfoResponse;
import com.mosaic.auth.jwt.JwtProvider;
import com.mosaic.auth.service.MemberService;
import com.mosaic.auth.service.RedisService;
import com.mosaic.auth.util.CookieUtil;
import com.mosaic.auth.dto.MemberPrincipal;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/test")
public class TestController {

    private final JwtProvider jwtProvider;
    private final RedisService redisService;
    private final MemberService memberService;

    {
        log.info("TestController 생성됨! 매핑 경로: /test");
    }

    @GetMapping("/public")
    public ResponseEntity<String> publicEndpoint() {
        log.info("Public 엔드포인트 호출됨: /test/public");
        return ResponseEntity.ok("이 엔드포인트는 인증이 필요하지 않습니다.");
    }

    @GetMapping("/secured")
    public ResponseEntity<String> securedEndpoint(
            @AuthenticationPrincipal(errorOnInvalidType = false) MemberPrincipal member,
            @RequestHeader(value = "X-Member-Id", required = false) String memberId,
            @RequestHeader(value = "X-Is-Bot", required = false) String isBot) {
        
        log.info("Secured 엔드포인트 호출됨: /test/secured | Member: {}, Member ID: {}, Is Bot: {}", 
                 member != null ? member.getId() : "없음", 
                 memberId, isBot);
        return ResponseEntity.ok(String.format(
            "인증 성공! Member ID: %s, Is Bot: %s, Authenticated Member: %s", 
            memberId != null ? memberId : "없음", 
            isBot != null ? isBot : "없음",
            member != null ? member.getId() : "없음"
        ));
    }
    
    // 테스트용 JWT 토큰 생성 엔드포인트
    @GetMapping("/generate-token/{memberId}")
    public ResponseEntity<String> generateToken(
            @PathVariable Integer memberId,
            HttpServletResponse response) {
        
        log.info("토큰 생성 엔드포인트 호출됨. Member ID: {}", memberId);
        // JWT 토큰 생성
        String accessToken = jwtProvider.createAccessToken(memberId);
        
        // Redis에 저장
        redisService.saveAccessToken(memberId, accessToken, jwtProvider.getAccessTokenValidity());
        
        // 쿠키에 저장
        CookieUtil.addCookie(response, "access-token", accessToken,
            (int)(jwtProvider.getAccessTokenValidity() / 1000));
        
        return ResponseEntity.ok("테스트용 토큰이 생성되었습니다: " + accessToken);
    }
    
    // 회원 정보 조회 엔드포인트
    @GetMapping("/member/{memberId}")
    public ResponseEntity<MemberInfoResponse> getMemberInfo(@PathVariable Integer memberId) {
        log.info("회원 정보 조회 엔드포인트 호출됨. Member ID: {}", memberId);
        return ResponseEntity.ok(memberService.getMemberInfo(memberId));
    }
} 
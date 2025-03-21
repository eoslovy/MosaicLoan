package com.mosaic.auth.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosaic.auth.domain.Member;
import com.mosaic.auth.jwt.JwtProvider;
import com.mosaic.auth.model.KakaoMemberResponse;
import com.mosaic.auth.model.KakaoTokenResponse;
import com.mosaic.auth.util.CookieUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

@Slf4j
@Service
@RequiredArgsConstructor
public class KakaoOAuthService {

    @Value("${kakao.client-id}")
    private String clientId;

    @Value("${kakao.redirect-uri}")
    private String redirectUri;

    private final MemberService memberService;
    private final JwtProvider jwtProvider;
    private final ObjectMapper objectMapper;

    public String getKakaoLoginUrl() {
        return UriComponentsBuilder
                .fromHttpUrl("https://kauth.kakao.com/oauth/authorize")
                .queryParam("client_id", clientId)
                .queryParam("redirect_uri", redirectUri)
                .queryParam("response_type", "code")
                .toUriString();
    }

    public void processKakaoLogin(String code, HttpServletResponse response) throws IOException {
        // 1. 인가코드로 토큰 발급
        KakaoTokenResponse token = getAccessToken(code);

        // 2. 카카오 유저 정보 조회
        KakaoMemberResponse kakaoMember = getMemberInfo(token.getAccessToken());

        // 3. DB 저장 or 기존 유저 조회
        Member member = memberService.findOrCreateMember(kakaoMember);

        // 4. JWT 발급
        String accessToken = jwtProvider.createAccessToken(member.getId(), member.getName());
        String refreshToken = jwtProvider.createRefreshToken(member.getId(), member.getName());

        // 5. Redis에 refresh-token 저장
        jwtProvider.saveRefreshToken(member.getId(), refreshToken);

        // 6. 액세스 토큰만 쿠키에 저장
        CookieUtil.addCookie(response, "access-token", accessToken, 
                (int) (jwtProvider.getAccessTokenValidity() / 1000));
    }

    private KakaoTokenResponse getAccessToken(String code) throws IOException {
        String urlStr = "https://kauth.kakao.com/oauth/token";
        URL url = new URL(urlStr);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setRequestMethod("POST");
        conn.setDoOutput(true);
        String params = "grant_type=authorization_code"
                + "&client_id=" + clientId
                + "&redirect_uri=" + redirectUri
                + "&code=" + code;

        conn.getOutputStream().write(params.getBytes());

        return objectMapper.readValue(conn.getInputStream(), KakaoTokenResponse.class);
    }

    private KakaoMemberResponse getMemberInfo(String accessToken) throws IOException {
        URL url = new URL("https://kapi.kakao.com/v2/user/me");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Authorization", "Bearer " + accessToken);

        return objectMapper.readValue(conn.getInputStream(), KakaoMemberResponse.class);
    }
}

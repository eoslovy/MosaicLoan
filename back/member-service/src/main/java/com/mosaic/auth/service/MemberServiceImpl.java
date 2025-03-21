package com.mosaic.auth.service;

import com.mosaic.auth.domain.Member;
import com.mosaic.auth.jwt.JwtProvider;
import com.mosaic.auth.model.KakaoMemberResponse;
import com.mosaic.auth.repository.MemberRepository;
import com.mosaic.auth.util.CookieUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final JwtProvider jwtProvider;

    @Override
    @Transactional
    public Member findOrCreateMember(KakaoMemberResponse kakaoMemberResponse) {
        return memberRepository.findByOauthId(kakaoMemberResponse.getId())
                .orElseGet(() -> {
                    Member member = new Member();
                    member.setOauthId(kakaoMemberResponse.getId());
                    member.setName(kakaoMemberResponse.getNickname());
                    return memberRepository.save(member);
                });
    }

    @Override
    public boolean logout(HttpServletResponse response, String accessToken) {
        try {
            // 토큰 유효성 검증
            if (!jwtProvider.validateToken(accessToken)) {
                return false;
            }
            
            // 이미 블랙리스트에 있는 토큰인지 확인
            if (jwtProvider.isBlacklisted(accessToken)) {
                return false;
            }

            // 액세스 토큰을 블랙리스트에 추가
            jwtProvider.blacklistToken(accessToken, jwtProvider.getAccessTokenValidity());
            
            // 액세스 토큰 쿠키 제거
            CookieUtil.deleteCookie(response, "access-token");
            
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}


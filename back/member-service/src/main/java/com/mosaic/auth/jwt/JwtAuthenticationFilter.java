package com.mosaic.auth.jwt;

import com.mosaic.auth.model.MemberPrincipal;
import com.mosaic.auth.util.CookieUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain)
            throws ServletException, IOException {

        String token = extractAccessTokenFromCookie(request);

        if (token != null && jwtProvider.validateToken(token) && !jwtProvider.isBlacklisted(token)) {
            Long memberId = jwtProvider.getMemberIdFromToken(token);
            String name = jwtProvider.getNameFromToken(token);
            
            // 토큰 만료 시간 확인
            if (isTokenExpiringSoon(token)) {
                // 만료가 임박한 경우 리프레시 토큰으로 갱신
                String refreshToken = jwtProvider.getRefreshToken(memberId);
                if (refreshToken != null && jwtProvider.validateToken(refreshToken)) {
                    String newAccessToken = jwtProvider.createAccessToken(memberId, name);
                    CookieUtil.addCookie(response, "access-token", newAccessToken, 
                            (int) (jwtProvider.getAccessTokenValidity() / 1000));
                }
            }

            MemberPrincipal memberPrincipal = new MemberPrincipal(memberId, name);
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(memberPrincipal, null, memberPrincipal.getAuthorities());
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    private String extractAccessTokenFromCookie(HttpServletRequest request) {
        return CookieUtil.getCookieValue(request, "access-token");
    }

    // 만료 10분 전부터 갱신
    private boolean isTokenExpiringSoon(String token) {
        long tenMinutes = 10 * 60 * 1000;
        return jwtProvider.getExpiration(token).getTime() - System.currentTimeMillis() < tenMinutes;
    }
}

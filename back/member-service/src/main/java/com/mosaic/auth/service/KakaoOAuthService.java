package com.mosaic.auth.service;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

public interface KakaoOAuthService {
    String getKakaoLoginUrl();
    void processKakaoLogin(String code, HttpServletResponse response) throws IOException;
}

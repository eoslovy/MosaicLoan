package com.mosaic.auth.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class CookieUtil {

    public static Cookie createHttpOnlyCookie(String name, String value, int maxAgeInSeconds) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(maxAgeInSeconds);
        // cookie.setSecure(true);
        // cookie.setAttribute("SameSite", "Strict");
        return cookie;
    }

    public static void addCookie(HttpServletResponse response, String name, String value, int maxAge) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(maxAge);
        // cookie.setSecure(true);
        // cookie.setAttribute("SameSite", "Strict");
        response.addCookie(cookie);
    }

    public static String getCookieValue(HttpServletRequest request, String name) {
        if (request.getCookies() == null) return null;
        for (Cookie cookie : request.getCookies()) {
            if (cookie.getName().equals(name)) {
                return cookie.getValue();
            }
        }
        return null;
    }

    public static void deleteCookie(HttpServletResponse response, String name) {
        Cookie cookie = new Cookie(name, null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        // cookie.setSecure(true);
        // cookie.setAttribute("SameSite", "Strict");
        response.addCookie(cookie);
    }
}

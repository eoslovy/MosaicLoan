package com.mosaic.auth.util;

import com.mosaic.auth.exception.CookieNotFoundException;
import com.mosaic.auth.exception.ErrorCode;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class CookieUtil {

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
		if (request.getCookies() == null) {
			throw new CookieNotFoundException(ErrorCode.COOKIE_NOT_FOUND);
		}

		for (Cookie cookie : request.getCookies()) {
			if (cookie.getName().equals(name)) {
				return cookie.getValue();
			}
		}
		throw new CookieNotFoundException(ErrorCode.COOKIE_VALUE_NOT_FOUND, name);
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

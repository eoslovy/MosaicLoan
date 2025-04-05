// package com.mosaic.auth.config;
//
// import java.util.Arrays;
//
// import org.springframework.context.annotation.Bean;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.CorsConfigurationSource;
// import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//
// // @Configuration
// // @EnableWebSecurity
// public class SecurityConfig {
//
// 	@Bean
// 	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
// 		return http
// 			.cors(cors -> cors.configurationSource(corsConfigurationSource()))
// 			.csrf(csrf -> csrf.disable())
// 			.formLogin(login -> login.disable())
// 			.httpBasic(basic -> basic.disable())
// 			.authorizeHttpRequests(auth -> auth
// 				.anyRequest().permitAll()
// 			)
// 			.build();
// 	}
//
// 	@Bean
// 	public CorsConfigurationSource corsConfigurationSource() {
// 		CorsConfiguration configuration = new CorsConfiguration();
// 		configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // 프론트엔드 URL
// 		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
// 		configuration.setAllowedHeaders(Arrays.asList("*"));
// 		configuration.setAllowCredentials(true);
//
// 		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
// 		source.registerCorsConfiguration("/**", configuration);
// 		return source;
// 	}
// }

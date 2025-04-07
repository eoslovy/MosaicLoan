package com.mosaic.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// @SpringBootApplication(exclude = {
// 	SecurityAutoConfiguration.class,
// 	UserDetailsServiceAutoConfiguration.class,
// 	SecurityFilterAutoConfiguration.class
// })
@SpringBootApplication
public class MosaicMemberApplication {

	public static void main(String[] args) {
		// 보안 관련 프로퍼티 설정
		// System.setProperty("spring.security.enabled", "false");
		// System.setProperty("management.security.enabled", "false");
		// System.setProperty("spring.security.filter.dispatcher-types", "none");
		// System.setProperty("spring.security.filter.order", "-2147483648");
		SpringApplication.run(MosaicMemberApplication.class, args);
	}

	// @Bean
	// public WebSecurityCustomizer webSecurityCustomizer() {
	// 	return (web) -> web.ignoring().anyRequest();
	// }

}

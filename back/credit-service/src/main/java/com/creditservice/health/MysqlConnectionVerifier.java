package com.creditservice.health;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class MysqlConnectionVerifier implements ApplicationRunner {

	private final PingRepository pingRepository;

	public MysqlConnectionVerifier(PingRepository pingRepository) {
		this.pingRepository = pingRepository;
	}

	@Override
	public void run(ApplicationArguments args) {
		try {
			long count = pingRepository.count();
			System.out.println("✅ MySQL connection successful. Ping count = " + count);
		} catch (Exception e) {
			System.err.println("❌ MySQL connection failed: " + e.getMessage());
		}
	}
}
package com.mosaic.credit.evaluation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class CreditEvalutaionServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(CreditEvalutaionServiceApplication.class, args);
	}

}

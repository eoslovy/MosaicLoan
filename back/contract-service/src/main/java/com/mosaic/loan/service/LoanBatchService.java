package com.mosaic.loan.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.mosaic.contract.service.ContractService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class LoanBatchService {

	private final LoanService loanService;
	private final ContractService contractService;

	//22시 utc/seoul 트리거
	public void runSchedulesAt21(LocalDateTime time, Boolean isBot) {
		// loan 도메인의 일일 정산 로직 등 실행
		try {
			loanService.manageInterestOfDelinquentLoans(time, isBot);
			loanService.liquidateScheduledDelinquentLoans(time, isBot);
			loanService.findRepaymentDueLoansAndRequestRepayment(time, isBot);
		} catch (Exception e) {
			log.error(e.getMessage());
		}

		log.info("[LoanBatch] 실행됨 time: {} isBot: {}", time, isBot);
	}

	public void renSchedulesAt22(LocalDateTime time, Boolean isBot) throws Exception {
		try {
			loanService.executeDueLoanRepayments(time, isBot);
		} catch (Exception e) {
			log.error(e.getMessage());
		}
	}
}

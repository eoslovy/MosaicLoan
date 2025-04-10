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
		log.info("[{}] 오후 9시에 실행되는 일괄 스케쥴러 실행", time);
		try {
			loanService.manageInterestOfDelinquentLoans(time, isBot);
			log.info("[{}] 오후 9시에 실행되는 연체 이자 적용 완료", time);
			loanService.liquidateScheduledDelinquentLoans(time, isBot);
			log.info("[{}] 오후 9시에 실행되는 연쳬 대출 소유권 이전 완료", time);
			loanService.findRepaymentDueLoansAndRequestRepayment(time, isBot);
			log.info("[{}] 오후 9시에 실행되는 일괄 상환잔액 입금 요청 완료", time);
		} catch (Exception e) {
			log.error(e.getMessage());
		}

		log.info("[LoanBatch] 실행됨 time: {} isBot: {}", time, isBot);
	}

	public void renSchedulesAt22(LocalDateTime time, Boolean isBot) throws Exception {
		try {
			loanService.executeDueLoanRepayments(time, isBot);
			log.info("[{}] 오후 10시에 실행되는 대출 처리 완료", time);
		} catch (Exception e) {
			log.error(e.getMessage());
		}
	}
}

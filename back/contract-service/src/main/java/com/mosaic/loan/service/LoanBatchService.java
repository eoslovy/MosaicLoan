package com.mosaic.loan.service;

import com.mosaic.contract.service.ContractService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class LoanBatchService {

	private final LoanService loanService;
	private final ContractService contractService;

	//22시 utc/seoul 트리거
	@Transactional
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
			log.info("9시에 처리되는 업무가 제대로 처리되지 않았어요");
		}
		try {
			Thread.sleep(20000);
		} catch (InterruptedException e) {

		}
		log.info("[LoanBatch] 실행됨 time: {} isBot: {}", time, isBot);
	}

	@Transactional
	public void runSchedulesAt22(LocalDateTime time, Boolean isBot) {
		try {
			loanService.executeDueLoanRepayments(time, isBot);
			log.info("[{}] 오후 10시에 실행되는 대출 처리 완료", time);
		} catch (Exception e) {
			log.info("10시에 처리되는 업무가 제대로 처리되지 않았어요");
		}
	}
}

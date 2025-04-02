package com.mosaic.loan.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mosaic.loan.dto.CreateLoanRequestDto;
import com.mosaic.loan.service.LoanService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("loans")
public class LoanController {

	LoanService loanService;

	//TODO 돈 빌리기
	//api : 신용평가 api
	//pub : 대출신청 발행
	//sub : 빌려줄 돈 모금 로직
	//approve : 모금이 완료되면 검증
	//append: 데이터베이스에 해당 사항 반영
	//pub : 대출 모금 금액 계좌로 인출
	//status: 대출 상태 실행으로 변경
	//sub : 인출 확인 트랜젝션
	@PostMapping("")
	public String createLoan(CreateLoanRequestDto request) {
		loanService.createLoan(request);
		return null;
	}

	//TODO 돈 갚기(스케쥴러)
	//scheduele: 돈 갚는 계약
	//pub: 계좌기준으로 kafka 이벤트 발행
	//sub: 계좌에 돈 입금 확인
	//transaction: 이자 및 금액 분배
	@PostMapping("")
	public ResponseEntity<?> repayLoan(){
		return null;
	}

	//TODO 내 대출내역 확인
	@GetMapping("")
	public ResponseEntity<?> getLoans() {
		return null;
	}

	//TODO 내 개별 투자의 거래내역 확인
	@GetMapping("")
	public ResponseEntity<?> getLoanTransactions(){
		return null;
	}
}

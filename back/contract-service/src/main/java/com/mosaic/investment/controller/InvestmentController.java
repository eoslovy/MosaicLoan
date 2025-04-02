package com.mosaic.investment.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mosaic.investment.dto.StartInvestRequestDto;
import com.mosaic.investment.service.InvestmentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("investment")
public class InvestmentController {

	InvestmentService investmentService;

	//TODO 투자하기
	@PostMapping("")
	public String startInvestment(StartInvestRequestDto requestDto) {
		investmentService.createInvestment(requestDto);
		return null;
	}

	//TODO 빌려줄 수 있는지 여부 확인
	@GetMapping("balances/total")
	public String getTotalBalance() {
		return null;
	}


	
	//TODO 종료하고 계좌로 환급하기
	//TODO 돈 환급(스케쥴러)
	//scheduele: 돈 환급 계약 만료
	//approve: 계약이 완료되었는지 확인
	//error: 미상환 계약 여부 확인 및 자동 이전처리
	//pub: 계좌기준으로 kafka 이벤트 발행
	//sub: 계좌에 돈 입금 처리 완료 확인
	//approve: 계약 status 종료
}

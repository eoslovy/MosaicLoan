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

	//TODO 돈빌리기
	InvestmentService investmentService;

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
}

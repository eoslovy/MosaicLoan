package com.mosaic.investment.service;

import java.time.Instant;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.mosaic.core.exception.InternalSystemException;
import com.mosaic.core.model.Investment;
import com.mosaic.core.util.InternalApiClient;
import com.mosaic.core.util.TimeUtil;
import com.mosaic.investment.dto.StartInvestRequestDto;
import com.mosaic.investment.repository.InvestmentRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class InvestmentServiceImpl implements InvestmentService {

	InvestmentRepository investmentRepository;
	InternalApiClient internalApiClient;

	@Override
	public void publishInvestment(StartInvestRequestDto requestDto) throws InternalSystemException {
		//TODO 계좌 잔고 확인
		// pub : 투자 생성 Event 발행
		// sub : check money exist Listener
		// 동기 : create Investment

		//계좌에 돈이 없는 경우


	}
	@Override
	public void createInvestment(StartInvestRequestDto requestDto) throws InternalSystemException {
		investmentRepository.save(
			Investment.builder()
				.targetRate(requestDto.targetRate())
				.principal(requestDto.principal())
				.amount(requestDto.principal())
				.dueDate(TimeUtil.nowKst())
				.createdAt(Instant.from(LocalDateTime.now()))
				.build()
		);
	}
}

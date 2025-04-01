package com.mosaic.investment.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;

import org.springframework.stereotype.Service;

import com.mosaic.core.util.TimeUtil;
import com.mosaic.investment.dto.StartInvestRequestDto;
import com.mosaic.investment.repository.InvestmentRepository;
import com.mosaic.core.model.Investment;

@Service
public class InvestmentServiceImpl implements InvestmentService {

	InvestmentRepository investmentRepository;

	@Override
	public void createInvestment(StartInvestRequestDto requestDto) {
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

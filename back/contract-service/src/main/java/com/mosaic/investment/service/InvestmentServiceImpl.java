package com.mosaic.investment.service;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.core.exception.InternalSystemException;
import com.mosaic.core.model.Investment;
import com.mosaic.core.util.TimeUtil;
import com.mosaic.investment.dto.ApprovedInvestmentDto;
import com.mosaic.investment.dto.RequestInvestmentDto;
import com.mosaic.investment.event.message.AccountTransactionPayload;
import com.mosaic.investment.event.producer.InvestmentKafkaProducer;
import com.mosaic.investment.repository.InvestmentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class InvestmentServiceImpl implements InvestmentService {

	private final InvestmentRepository investmentRepository;
	private final InvestmentKafkaProducer investmentProducer;

	@Override
	public void publishInvestment(RequestInvestmentDto requestDto) throws
		InternalSystemException,
		JsonProcessingException {
		//TODO 멱등성 : 시간기준 UUID 및 요청별 request막는 ttl 발행
		Integer idempotencyKey = requestDto.hashCode();
		Investment newInvestment = Investment.builder()
			.targetRate(requestDto.targetRate())
			.currentRate(0)
			.dueDate(TimeUtil.dueDate(TimeUtil.nowDate(), requestDto.targetMonth()))
			.accountId(requestDto.id())
			.principal(requestDto.principal())
			.amount(requestDto.principal())
			.createdAt(TimeUtil.now())
			.build();
		investmentRepository.save(newInvestment);
		AccountTransactionPayload requestEvent = AccountTransactionPayload.buildInvest(newInvestment);
		// pub : 투자 생성 Event 발행
		// sub : check money exist Listener
		// 동기 : create Investment
		investmentProducer.sendLoanCreatedEvent(requestEvent);
	}

	@Override
	public void createInvestment(ApprovedInvestmentDto requestDto) throws InternalSystemException {

	}
}

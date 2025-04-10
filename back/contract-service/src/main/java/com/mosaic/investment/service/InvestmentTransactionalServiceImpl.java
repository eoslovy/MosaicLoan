package com.mosaic.investment.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.core.model.Investment;
import com.mosaic.investment.dto.WithdrawalInvestmentDto;
import com.mosaic.investment.event.producer.InvestmentKafkaProducer;
import com.mosaic.investment.exception.InvestmentNotFoundException;
import com.mosaic.investment.repository.InvestmentRepository;
import com.mosaic.payload.AccountTransactionPayload;

import jakarta.transaction.Transactional;

@Service
public class InvestmentTransactionalServiceImpl implements InvestmentTransactionalService {

	InvestmentKafkaProducer investmentProducer;
	InvestmentRepository investmentRepository;

	@Transactional
	@Override
	public void publishInvestmentWithdrawal(WithdrawalInvestmentDto requestDto, LocalDateTime now, Boolean isBot) throws
		JsonProcessingException {
		Investment investment = investmentRepository.findById(requestDto.id())
			.orElseThrow(() -> new InvestmentNotFoundException(requestDto.id()));

		BigDecimal withdrawnAmount = investment.withdrawAll();
		investment.finishInvestment();
		AccountTransactionPayload investWithdrawalPayload = AccountTransactionPayload.buildInvestWithdrawal(investment,
			withdrawnAmount, now);

		investmentProducer.sendInvestmentWithdrawalRequest(investWithdrawalPayload);
	}

}

package com.mosaic.investment.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.core.exception.InternalSystemException;
import com.mosaic.core.model.Investment;
import com.mosaic.core.model.Loan;
import com.mosaic.investment.dto.RequestInvestmentDto;
import com.mosaic.investment.event.producer.InvestmentKafkaProducer;
import com.mosaic.investment.repository.InvestmentRepository;
import com.mosaic.loan.repository.LoanRepository;
import com.mosaic.payload.AccountTransactionPayload;
import com.mosaic.payload.ContractTransactionPayload;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class InvestmentServiceImpl implements InvestmentService {

	private final InvestmentRepository investmentRepository;
	private final LoanRepository loanRepository;
	private final InvestmentKafkaProducer investmentProducer;

	@Override
	public void publishInvestmentRequest(RequestInvestmentDto requestDto) throws
		InternalSystemException, JsonProcessingException {
		//TODO 멱등성 : 시간기준 UUID 및 요청별 request막는 ttl 발행
		Integer idempotencyKey = requestDto.hashCode();
		Investment newInvestment = Investment.requestOnlyFormInvestment(requestDto);
		var saved = investmentRepository.save(newInvestment);
		AccountTransactionPayload requestEvent = AccountTransactionPayload.buildInvest(saved, requestDto);
		investmentProducer.sendInvestmentCreatedEvent(requestEvent);
	}

	@Override
	public void completeInvestmentRequest(AccountTransactionPayload completeInvestmentRequest) throws Exception {
		Optional<Investment> getNewInvestment = investmentRepository.findById(completeInvestmentRequest.targetId());
		if (getNewInvestment.isEmpty())
			throw new Exception("해당하는 투자계좌 없음 에러");
		Investment newInvestment = getNewInvestment.get();
		newInvestment.completeRequest(completeInvestmentRequest);
		// investmentProducer.sendInvestmentConfirmedEvent(completeInvestmentRequest);
	}

	@Override
	public void searchLoanAptInvestor(ContractTransactionPayload loanTransactionReq) throws Exception {
		//Todo 해당 대출 계좌 검색 Exception처리
		Optional<Loan> targetLoan = loanRepository.findById(loanTransactionReq.targetId());
		if (targetLoan.isEmpty())
			throw new Exception("구현예정");

		//Todo 목표수익률 미만, 투자 잔액 특정금액(MAX(최소기준금액, 본인원금분산비율) 이상 대상계좌 검색 (잔액이 미달량이 클수록)

		//Todo Stream으로 투자금액을 관리하는 Wrapper Dto를 만들어주면 될듯?

		//투자금액이 모이면 Transaction Start;
	}
}

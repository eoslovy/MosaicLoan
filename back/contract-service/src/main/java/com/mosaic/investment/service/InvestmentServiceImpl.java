package com.mosaic.investment.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.core.exception.InternalSystemException;
import com.mosaic.core.model.Investment;
import com.mosaic.core.model.Loan;
import com.mosaic.investment.dto.RequestInvestmentDto;
import com.mosaic.investment.dto.WithdrawalInvestmentDto;
import com.mosaic.investment.event.producer.InvestmentKafkaProducer;
import com.mosaic.investment.exception.InvestmentNotFoundException;
import com.mosaic.investment.repository.InvestmentRepository;
import com.mosaic.loan.repository.LoanRepository;
import com.mosaic.payload.AccountTransactionPayload;
import com.mosaic.payload.ContractTransactionPayload;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class InvestmentServiceImpl implements InvestmentService {
	//TODO 진입점 기준으로 서비스 쪼개기
	private final InvestmentRepository investmentRepository;
	private final LoanRepository loanRepository;
	private final InvestmentKafkaProducer investmentProducer;
	
	//입금
	@Override
	@Transactional
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
	@Transactional
	public void completeInvestmentRequest(AccountTransactionPayload completeInvestmentRequest)
			throws InternalSystemException, JsonProcessingException {
		Optional<Investment> optionalInvestment = investmentRepository.findById(completeInvestmentRequest.targetId());
		if (optionalInvestment.isEmpty()) {
			investmentProducer.sendInvestmentRejectedEvent(completeInvestmentRequest);
			throw new InvestmentNotFoundException(completeInvestmentRequest.targetId());
		}
		Investment investment = optionalInvestment.get();
		investment.completeRequest(completeInvestmentRequest);
	}
	//투자 종료
	@Override
	public void finishActiveInvestment(Investment investment) {
	}
	
	
	//출금
	@Override
	public void publishInvestmentWithdrawal(WithdrawalInvestmentDto requestDto) throws JsonProcessingException {
		Investment investment = investmentRepository.findById(requestDto.id())
				.orElseThrow(() -> new InvestmentNotFoundException(requestDto.id()));

		BigDecimal withdrawnAmount = investment.withdrawAll();
		investment.finishInvestment();
		AccountTransactionPayload investWithdrawalPayload = AccountTransactionPayload.buildInvestWithdrawal(investment, withdrawnAmount);

		investmentProducer.sendInvestmentWithdrawalEvent(investWithdrawalPayload);
	}
	@Override
	public void rollbackInvestmentWithdrawal(AccountTransactionPayload payload) {
		Investment investment = investmentRepository.findById(payload.targetId())
				.orElseThrow(() -> new InvestmentNotFoundException(payload.targetId()));
		investment.rollBack(payload.amount());
		investment.unFinishInvestment();
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

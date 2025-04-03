package com.mosaic.loan.service;

import com.mosaic.loan.event.producer.LoanKafkaProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.mosaic.loan.dto.CreateLoanRequestDto;
import com.mosaic.loan.repository.LoanRepository;

@Service
@RequiredArgsConstructor
public class LoanServiceImpl implements LoanService {

	private final LoanKafkaProducer loanKafkaProducer;
	private final LoanRepository loanRepository;

	@Override
	public void createLoan(CreateLoanRequestDto request) {
		//Todo 내부 신용평가 확인후 예외처리(없음, 시간지남 등등)

		//Todo 내부 신용평가 검증 후 빈깡통계좌 개설 및 발행 -> investConsumer에서 수신
	}

	public void completeLoan(){
		//Todo loanConumser에서 완료 수신 후 loan증가
	}
}

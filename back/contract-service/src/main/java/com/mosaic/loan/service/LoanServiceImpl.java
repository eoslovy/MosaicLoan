package com.mosaic.loan.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.core.model.Loan;
import com.mosaic.core.util.InternalApiClient;
import com.mosaic.loan.dto.CreateLoanRequestDto;
import com.mosaic.loan.dto.CreditEvaluationResponseDto;
import com.mosaic.loan.dto.EvaluationStatus;
import com.mosaic.loan.event.message.LoanCreateTransactionPayload;
import com.mosaic.loan.event.producer.LoanKafkaProducer;
import com.mosaic.loan.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoanServiceImpl implements LoanService {

    private final LoanKafkaProducer loanKafkaProducer;
    private final LoanRepository loanRepository;
    private final InternalApiClient internalApiClient;

    @Override
    public void createLoan(CreateLoanRequestDto request) throws JsonProcessingException {
        //Todo 내부 신용평가 확인후 예외처리(없음, 시간지남 등등)
        CreditEvaluationResponseDto creditEvaluationResponseDto = internalApiClient.getMemberCreditEvaluation(request);
        if (!evaluateLoanRequest(creditEvaluationResponseDto)) return;
        Loan newLoan = Loan.requestOnlyFormLoan(request, creditEvaluationResponseDto);
        loanRepository.save(newLoan);
        loanKafkaProducer.sendLoanCreatedEvent(LoanCreateTransactionPayload.buildLoan(newLoan, creditEvaluationResponseDto));
    }

    private Boolean evaluateLoanRequest(CreditEvaluationResponseDto creditEvaluationResponseDto) {
        if (creditEvaluationResponseDto.getStatus().equals(EvaluationStatus.APPROVED)) return Boolean.TRUE;
        return Boolean.FALSE;
    }

    public void completeLoan() {
        //Todo loanConumser에서 완료 수신 후 loan증가
    }
}

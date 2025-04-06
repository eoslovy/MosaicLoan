package com.mosaic.loan.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.core.model.Contract;
import com.mosaic.core.model.ContractTransaction;
import com.mosaic.core.model.Loan;
import com.mosaic.core.model.status.LoanStatus;
import com.mosaic.core.util.InternalApiClient;
import com.mosaic.investment.dto.RequestInvestmentDto;
import com.mosaic.investment.dto.WithdrawalInvestmentDto;
import com.mosaic.loan.dto.CreateLoanRequestDto;
import com.mosaic.loan.dto.CreditEvaluationResponseDto;
import com.mosaic.loan.dto.EvaluationStatus;
import com.mosaic.loan.event.message.LoanCreateTransactionPayload;
import com.mosaic.loan.event.producer.LoanKafkaProducer;
import com.mosaic.loan.exception.LoanNotFoundException;
import com.mosaic.loan.repository.LoanRepository;
import com.mosaic.payload.AccountTransactionPayload;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Year;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class LoanServiceImpl implements LoanService {

    private final LoanKafkaProducer loanKafkaProducer;
    private final LoanRepository loanRepository;
    private final InternalApiClient internalApiClient;

    //투자 생성
    @Override
    public void createLoan(CreateLoanRequestDto request) throws JsonProcessingException {
        //Todo 내부 신용평가 확인후 예외처리(없음, 시간지남 등등)
        CreditEvaluationResponseDto creditEvaluationResponseDto = internalApiClient.getMemberCreditEvaluation(request);
        if (!evaluateLoanRequest(creditEvaluationResponseDto)) return;
        Loan newLoan = Loan.requestOnlyFormLoan(request, creditEvaluationResponseDto);
        loanRepository.save(newLoan);
        loanKafkaProducer.sendLoanCreatedEvent(LoanCreateTransactionPayload.buildLoan(newLoan, creditEvaluationResponseDto));
    }

    //상환입금
    @Override
    public void publishAndCalculateLoanRepayRequest(RequestInvestmentDto requestDto) throws JsonProcessingException {
        Loan loan = loanRepository.findByIdAndStatus(requestDto.id(), LoanStatus.IN_PROGRESS)
                .orElseThrow(() -> new LoanNotFoundException(requestDto.id()));
        BigDecimal moneyToRepay = BigDecimal.ZERO;
        for (Contract contract : loan.getContracts()) {
            moneyToRepay = moneyToRepay.add(contract.getOutstandingAmount());
            BigDecimal interestOfContract = calculateInterestAmount(contract, contract.getOutstandingAmount());
            //contract.addInterestAmountToOutstandingAmount(interestOfContract);
            moneyToRepay = moneyToRepay.add(interestOfContract);
        }
        loanKafkaProducer.sendLoanRepayRequestEvent(AccountTransactionPayload.buildLoanRepay(loan, moneyToRepay));
    }

    private BigDecimal calculateInterestAmount(Contract contract, BigDecimal amount) {
        long days = ChronoUnit.DAYS.between(contract.getDueDate(), contract.getCreatedAt().toLocalDate());
        BigDecimal dailyRate = BigDecimal.valueOf(contract.getInterestRate()).divide(BigDecimal.valueOf(365 + (Year.isLeap(contract.getCreatedAt().getYear()) ? 1 : 0)), 18, RoundingMode.DOWN);
        BigDecimal dailyInterest = amount
                .multiply(dailyRate)
                .divide(BigDecimal.valueOf(10000), 18, RoundingMode.DOWN);
        return dailyInterest
                .multiply(BigDecimal.valueOf(days))
                .setScale(5, RoundingMode.DOWN);
    }

    //상환 필요금과 실 상환금 비율 맞춰 분배
    @Override
    public void completeLoanRepayRequest(AccountTransactionPayload payload) throws Exception {
        Loan loan = loanRepository.findByIdAndStatus(payload.targetId(), LoanStatus.IN_PROGRESS)
                .orElseThrow(() -> new LoanNotFoundException(payload.targetId()));
        BigDecimal repaidAmountResidue = payload.amount();
        BigDecimal originalMoneyToRepay = BigDecimal.ZERO;
        BigDecimal interestToRepay = BigDecimal.ZERO;
        for (Contract contract : loan.getContracts()) {
            originalMoneyToRepay = originalMoneyToRepay.add(contract.getOutstandingAmount());
            BigDecimal interestOfContract = calculateInterestAmount(contract, contract.getOutstandingAmount());
            interestToRepay = interestToRepay.add(interestOfContract);
        }
        //총 상환 비율
        BigDecimal returnInterestRatio = repaidAmountResidue.divide(interestToRepay, 18, RoundingMode.DOWN).min(BigDecimal.ONE);
        if (BigDecimal.ZERO.compareTo(returnInterestRatio) >= 0) {
            return; //상환비율 0 처리불가능
        }

        for (Contract contract : loan.getContracts()) {
            BigDecimal calculatedTotalInterest = calculateInterestAmount(contract, contract.getOutstandingAmount());
            ContractTransaction interestTransaction = ContractTransaction.buildRepayInterestTransaction(contract, calculatedTotalInterest.multiply(returnInterestRatio));
            contract.updateOutstandingAmountAfterInterestRepaid(calculatedTotalInterest, interestTransaction.getAmount());
            contract.putTransaction(interestTransaction);

            repaidAmountResidue = repaidAmountResidue.subtract(interestTransaction.getAmount());
        }

        BigDecimal returnPrincipalRatio = repaidAmountResidue.divide(originalMoneyToRepay, 18, RoundingMode.DOWN).min(BigDecimal.ONE);
        if (BigDecimal.ZERO.compareTo(returnPrincipalRatio) >= 0) {
            return; //상환비율 0 처리불가능
        }
        for (Contract contract : loan.getContracts()) {
            BigDecimal calculatedTotalPrincipal = contract.getOutstandingAmount();
            ContractTransaction principalTransaction = ContractTransaction.buildRepayPrincipalTransaction(contract, calculatedTotalPrincipal.multiply(returnPrincipalRatio));
            contract.updateOutstandingAmountAfterPrincipalRepaid(principalTransaction);
            contract.putTransaction(principalTransaction);

            repaidAmountResidue = repaidAmountResidue.subtract(principalTransaction.getAmount());
        }

        if (repaidAmountResidue.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalStateException("받은 돈보다 더 많이 분배했습니다.");
        }
        //TODO 현재투자 수익률 재조정식
        //이자상환
        //Transaction만들기

        //원금상환
        //Transaction만들기

    }

    //대출금 출금
    @Override
    public void publishLoanWithdrawal(WithdrawalInvestmentDto requestDto) throws JsonProcessingException {
        Loan loan = loanRepository.findById(requestDto.id())
                .orElseThrow(() -> new LoanNotFoundException(requestDto.id()));
        BigDecimal withdrawnAmount = loan.withdrawAll();
        AccountTransactionPayload withdrawalEventPayload = AccountTransactionPayload.buildLoanWithdrawal(loan, withdrawnAmount);
        loanKafkaProducer.sendLoanWithdrawalEvent(withdrawalEventPayload);
    }

    @Override
    public void rollbackLoanWithdrawal(AccountTransactionPayload payload) {
        Loan loan = loanRepository.findById(payload.targetId())
                .orElseThrow(() -> new LoanNotFoundException(payload.targetId()));
        loan.rollBack(payload.amount());

    }

    private Boolean evaluateLoanRequest(CreditEvaluationResponseDto creditEvaluationResponseDto) {
        if (creditEvaluationResponseDto.getStatus().equals(EvaluationStatus.APPROVED)) return Boolean.TRUE;
        return Boolean.FALSE;
    }


    public void completeLoan() {
        //Todo loanConumser에서 완료 수신 후 loan증가
    }
}

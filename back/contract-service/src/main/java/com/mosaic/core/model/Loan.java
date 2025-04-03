package com.mosaic.core.model;

import com.mosaic.core.model.status.LoanStatus;
import com.mosaic.core.util.TimeUtil;
import com.mosaic.loan.dto.CreateLoanRequestDto;
import com.mosaic.loan.dto.CreditEvaluationResponseDto;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "loan", schema = "mosaic_contract")
public class Loan {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "account_id", nullable = false)
    private Integer accountId;

    @Column(name = "evaluation_id", nullable = false)
    private Integer evaluationId;

    @Column(name = "request_amount", precision = 18, scale = 5)
    private BigDecimal requestAmount;

    @Column(name = "amount", precision = 18, scale = 5)
    private BigDecimal amount;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private LoanStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public static Loan requestOnlyFormLoan(CreateLoanRequestDto request, CreditEvaluationResponseDto creditEvaluationResponseDto) {
        return Loan.builder()
                .accountId(request.id())
                .amount(BigDecimal.valueOf(0))
                .createdAt(TimeUtil.now())
                .dueDate(request.due_date())
                .evaluationId(creditEvaluationResponseDto.getId())
                .requestAmount(request.requestAmount())
                .status(LoanStatus.PENDING)
                .build();
    }
}
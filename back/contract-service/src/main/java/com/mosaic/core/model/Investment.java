package com.mosaic.core.model;

import com.mosaic.core.model.status.InvestmentStatus;
import com.mosaic.core.util.TimeUtil;
import com.mosaic.investment.dto.RequestInvestmentDto;
import com.mosaic.payload.AccountTransactionPayload;
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
@Table(name = "investment", schema = "mosaic_contract")
public class Investment {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "account_id", nullable = false)
    private Integer accountId;

    @Column(name = "target_rate")
    private Integer targetRate;

    @Column(name = "current_rate")
    private Integer currentRate;

    @Column(name = "amount", precision = 18, scale = 5)
    private BigDecimal amount;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "principal", precision = 18, scale = 5)
    private BigDecimal principal;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private InvestmentStatus status;

    public static Investment requestOnlyFormInvestment(RequestInvestmentDto requestDto) {
        return Investment.builder()
                .status(InvestmentStatus.REQUESTED)
                .targetRate(requestDto.targetRate())
                .currentRate(0)
                .dueDate(TimeUtil.dueDate(TimeUtil.nowDate(), requestDto.targetWeeks()))
                .accountId(requestDto.id())
                .principal(requestDto.principal())
                .amount(BigDecimal.valueOf(0))
                .createdAt(TimeUtil.now())
                .build();
    }

    public void completeRequest(AccountTransactionPayload transactionPayload) {
        this.amount = transactionPayload.amount();
        this.principal = transactionPayload.amount();
        this.status = InvestmentStatus.ACTIVE;
    }
    public void finishInvestment() {
        this.status = InvestmentStatus.COMPLETED;
    }
    public void unFinishInvestment() {
        this.status = InvestmentStatus.ACTIVE;
    }
    public BigDecimal withDrawAll(){
        BigDecimal amount = this.amount;
        this.amount = BigDecimal.ZERO;
        return amount;
    }
    public void rollBack(BigDecimal amount){
        this.amount = amount;
    }
}
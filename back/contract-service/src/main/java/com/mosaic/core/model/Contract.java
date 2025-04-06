package com.mosaic.core.model;

import com.mosaic.core.model.status.ContractStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "contract", schema = "mosaic_contract")
public class Contract {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "loan_id", nullable = false)
    private Loan loan;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "investment_id", nullable = false)
    private Investment investment;
    @Builder.Default
    @OneToMany(mappedBy = "contract", cascade = CascadeType.ALL, orphanRemoval = false)
    private List<ContractTransaction> contractTransactions = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ContractStatus status;

    @Column(name = "amount", precision = 18, scale = 5)
    private BigDecimal amount;

    @Column(name = "outstanding_amount", precision = 18, scale = 5)
    private BigDecimal outstandingAmount;

    @Column(name = "paid_amount", precision = 18, scale = 5)
    private BigDecimal paidAmount;

    @Column(name = "delinquency_margin_rate")
    private Integer delinquencyMarginRate;

    @Column(name = "interest_rate")
    private Integer interestRate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public void addInterestAmountToOutstandingAmount(BigDecimal interest) {
        this.outstandingAmount = this.outstandingAmount.add(interest);
    }

    public void updateOutstandingAmountAfterInterestRepaid(BigDecimal calculatedTotalInterest, BigDecimal repaidInterest) {
        this.outstandingAmount = this.outstandingAmount.add(amount).subtract(repaidInterest);
    }

    public void putTransaction(ContractTransaction transaction) {
        transaction.setContract(this);
        contractTransactions.add(transaction);
    }

    public void updateOutstandingAmountAfterPrincipalRepaid(ContractTransaction principalTransaction) {
        this.outstandingAmount = this.outstandingAmount.subtract(principalTransaction.getAmount());
    }

    public void setLoan(Loan loan) {
        this.loan = loan;
    }
    public static Contract create(
            Loan loan,
            Investment investment,
            BigDecimal allocatedAmount,
            int interestRate,
            int delinquencyMarginRate,
            LocalDateTime now
    ) {
        return Contract.builder()
                .loan(loan)
                .investment(investment)
                .amount(allocatedAmount)
                .outstandingAmount(allocatedAmount)
                .paidAmount(BigDecimal.ZERO)
                .interestRate(interestRate)
                .delinquencyMarginRate(delinquencyMarginRate)
                .status(ContractStatus.IN_PROGRESS)
                .dueDate(loan.getDueDate())
                .createdAt(now)
                .build();
    }
}
package com.mosaic.core.model;

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

    @Lob
    @Column(name = "status")
    private String status;

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
}
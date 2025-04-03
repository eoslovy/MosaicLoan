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

    @Lob
    @Column(name = "status")
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

}
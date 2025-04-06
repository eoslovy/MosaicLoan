package com.mosaic.core.model;

import com.mosaic.core.model.status.ContractTransactionType;
import com.mosaic.core.util.TimeUtil;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "contract_transaction", schema = "mosaic_contract")
public class ContractTransaction {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;

    @Column(name = "amount")
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private ContractTransactionType type;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public void setContract(Contract contract) {
        this.contract = contract;
    }

    public static ContractTransaction buildRepayPrincipalTransaction(Contract contract, BigDecimal repaidAmount) {
        return ContractTransaction.builder().contract(contract).amount(repaidAmount).createdAt(TimeUtil.now()).type(ContractTransactionType.PRINCIPAL).build();
    }
    public static ContractTransaction buildRepayInterestTransaction(Contract contract, BigDecimal repaidAmount) {
        return ContractTransaction.builder().contract(contract).amount(repaidAmount).createdAt(TimeUtil.now()).type(ContractTransactionType.INTEREST).build();
    }
}
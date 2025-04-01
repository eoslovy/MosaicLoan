package com.mosaic.model;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "contract_transaction", schema = "mosaic_contract")
public class ContractTransaction {
	@Id
	@Column(name = "id", nullable = false)
	private Integer id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "contract_id", nullable = false)
	private Contract contract;

	@Column(name = "amount")
	private Integer amount;

	@Lob
	@Column(name = "type")
	private String type;

	@Column(name = "created_at")
	private Instant createdAt;

}
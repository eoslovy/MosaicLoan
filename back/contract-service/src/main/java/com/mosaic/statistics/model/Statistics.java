package com.mosaic.statistics.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(
	name = "statistics",
	uniqueConstraints = {
		@UniqueConstraint(name = "uq_target_actual_date", columnNames = {"targetRate", "actualRate", "resultDate"})
	},
	indexes = {
		@Index(name = "idx_result_date", columnList = "resultDate"),
		@Index(name = "idx_target_rate", columnList = "targetRate")
	}
)
public class Statistics {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private Integer targetRate;

	@Column(nullable = false)
	private Integer actualRate;

	@Column(nullable = false)
	private Integer count;

	@Column(nullable = false)
	private LocalDate resultDate;
}


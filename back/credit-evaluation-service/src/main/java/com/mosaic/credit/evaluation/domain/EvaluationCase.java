package com.mosaic.credit.evaluation.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "evaluation_case")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class EvaluationCase {

	@Id
	@Column(name = "case_id")
	private Long caseId;

	@Column(name = "is_checked", nullable = false)
	private Boolean isChecked;

	public void markAsChecked() {
		this.isChecked = true;
	}
}


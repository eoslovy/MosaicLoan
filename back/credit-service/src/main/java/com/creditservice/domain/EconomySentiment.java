package com.creditservice.domain;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "economy_sentiment")
@Getter
@NoArgsConstructor
public class EconomySentiment {

	@Id
	@Column(name = "sentiment_date")
	private LocalDate sentimentDate;

	@Column(name = "average_sentiment")
	private double averageSentiment;
}

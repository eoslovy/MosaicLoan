package com.mosaic.statistics.repository;

import java.math.BigDecimal;

public interface RateStatProjection {
	Integer getTargetRate();

	BigDecimal getActualRate();

	int getCount();
}

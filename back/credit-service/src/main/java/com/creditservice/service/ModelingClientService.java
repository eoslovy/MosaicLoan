package com.creditservice.service;

import java.util.Map;

public interface ModelingClientService {
	double getRepaymentProbability(Map<String, Object> features);
} 
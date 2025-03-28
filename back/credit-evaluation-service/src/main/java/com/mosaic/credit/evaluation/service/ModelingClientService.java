package com.mosaic.credit.evaluation.service;

import java.util.Map;

public interface ModelingClientService {
    double getRepaymentProbability(Map<String, Object> features);
} 
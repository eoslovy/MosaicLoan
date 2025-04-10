package com.mosaic.contract.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.mosaic.core.model.Contract;
import com.mosaic.core.model.Loan;

import jakarta.transaction.Transactional;

@Service
public interface ContractService {

	@Transactional
	Contract liquidateContract(Contract contract, LocalDateTime now);

	Contract adjustCurrentRateWhenInvest(Contract contract);

	Contract adjustCurrentRateWhenRepay(Contract contract);

	Contract adjustCurrentRateWhenLiquidate(Contract contract);
	@Transactional
	void addDelinquentMarginInterest(Loan loan);
}

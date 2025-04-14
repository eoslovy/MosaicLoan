package com.mosaic.contract.service;

import com.mosaic.core.model.Contract;
import com.mosaic.core.model.Loan;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public interface ContractService {

	Contract liquidateContract(Contract contract, LocalDateTime now);

	Contract adjustCurrentRateWhenInvest(Contract contract);

	Contract adjustCurrentRateWhenRepay(Contract contract);

	Contract adjustCurrentRateWhenLiquidate(Contract contract);

	void addDelinquentMarginInterest(Loan loan);
}

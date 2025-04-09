package com.mosaic.contract.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.mosaic.core.model.Contract;

@Service
public interface ContractService {
	public Contract liquidateContract(Contract contract, LocalDateTime now);

	public Contract adjustCurrentRateWhenInvest(Contract contract);

	public Contract adjustCurrentRateWhenRepay(Contract contract);

	public Contract adjustCurrentRateWhenLiquidate(Contract contract);
}

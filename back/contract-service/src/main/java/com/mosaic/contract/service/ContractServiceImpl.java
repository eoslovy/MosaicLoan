package com.mosaic.contract.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.mosaic.core.model.Contract;
import com.mosaic.core.model.ContractTransaction;
import com.mosaic.core.model.Investment;
import com.mosaic.core.model.Loan;

@Service
public class ContractServiceImpl implements ContractService {
	@Override
	public Contract liquidateContract(Contract contract, LocalDateTime now) {
		if (contract == null) {
			throw new IllegalArgumentException("Contract is null");
		}
		if (contract.getInvestment() == null) {
			throw new IllegalArgumentException("Investment is null");
		}
		//없으면 예외
		Investment investment = contract.getInvestment();
		contract.setStatusLiquidate();
		//Liquidated 스테이터스 변경 ,
		ContractTransaction transaction = ContractTransaction.buildLiquidateTransaction(contract, now);
		//Transaction Liquidated 만들어주고 집어넣기
		contract.putTransaction(transaction);
		//Investment에도 돈 올려주고;
		investment.subtractLiquidatedAmount(transaction);
		//기대수익률 다시 돌려놓기
		investment.subtractExpectYield(contract);
		return contract;
	}

	@Override
	public Contract adjustCurrentRateWhenInvest(Contract contract) {
		return null;
	}

	@Override
	public Contract adjustCurrentRateWhenRepay(Contract contract) {
		return null;
	}

	@Override
	public Contract adjustCurrentRateWhenLiquidate(Contract contract) {
		return null;
	}

	@Override
	public void addDelinquentMarginInterest(Loan loan) {
		if (loan.getContracts() == null) {
			throw new IllegalArgumentException("Loan is null");
		}
		for (Contract contract : loan.getContracts()) {
			contract.addExtraInterestDaily();
		}
	}
}

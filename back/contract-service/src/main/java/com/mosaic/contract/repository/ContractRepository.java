package com.mosaic.contract.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mosaic.core.model.Contract;

public interface ContractRepository extends JpaRepository<Contract, Integer> {
}

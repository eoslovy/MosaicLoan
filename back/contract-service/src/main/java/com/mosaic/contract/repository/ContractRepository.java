package com.mosaic.contract.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mosaic.core.model.Contract;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {
}

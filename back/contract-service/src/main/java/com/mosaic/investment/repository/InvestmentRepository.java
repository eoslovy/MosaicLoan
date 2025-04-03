package com.mosaic.investment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mosaic.core.model.Investment;

@Repository
public interface InvestmentRepository extends JpaRepository<Investment, Integer> {
}

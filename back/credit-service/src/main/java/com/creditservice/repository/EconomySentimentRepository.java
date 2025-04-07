package com.creditservice.repository;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.creditservice.domain.EconomySentiment;

@Repository
public interface EconomySentimentRepository extends JpaRepository<EconomySentiment, LocalDate> {
    
    Optional<EconomySentiment> findBySentimentDate(LocalDate date);
} 
package com.mosaic.accountservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mosaic.accountservice.domain.Account;

public interface AccountRepository extends JpaRepository<Account, Integer> {
}

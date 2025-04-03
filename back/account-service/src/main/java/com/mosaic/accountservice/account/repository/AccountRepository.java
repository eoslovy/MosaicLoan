package com.mosaic.accountservice.account.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mosaic.accountservice.account.domain.Account;

public interface AccountRepository extends JpaRepository<Account, Integer> {
}

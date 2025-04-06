package com.mosaic.accountservice.account.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.mosaic.accountservice.account.domain.AccountTransaction;
import com.mosaic.accountservice.account.dto.AccountTransactionSearchRequest;

public interface AccountTransactionQueryRepository {
	List<AccountTransaction> search(AccountTransactionSearchRequest request, Integer memberId, Pageable pageable);

	long count(AccountTransactionSearchRequest request, Integer memberId);
}

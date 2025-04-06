package com.mosaic.accountservice.account.service;

import java.math.BigDecimal;

public interface AccountService {

	void createAccount(Integer memberId);

	BigDecimal getCurrentCash(Integer memberId);
}

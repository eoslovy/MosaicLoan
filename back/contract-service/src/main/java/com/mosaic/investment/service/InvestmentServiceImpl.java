package com.mosaic.investment.service;

import java.time.Instant;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.mosaic.core.model.Investment;
import com.mosaic.core.util.InternalApiClient;
import com.mosaic.core.util.InternalApiTarget;
import com.mosaic.core.util.TimeUtil;
import com.mosaic.investment.dto.GetAccountResponseDto;
import com.mosaic.investment.dto.StartInvestRequestDto;
import com.mosaic.investment.repository.InvestmentRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class InvestmentServiceImpl implements InvestmentService {

	InvestmentRepository investmentRepository;
	InternalApiClient internalApiClient;

	@Override
	public void createInvestment(StartInvestRequestDto requestDto) {
		//TODO 계좌 잔고 확인
		try {
			internalApiClient.sendInvestmentRequest(
				requestDto, InternalApiTarget.ACCOUNT, InternalApiTarget.AccountUri.GET_ACCOUNT.getPath(),
				GetAccountResponseDto.class);
		}  catch (WebClientResponseException e) {
			log.warn("[투자 실패] 계좌 서비스 호출 실패 - status: {}, uri: {}, message: {}, body: {}",
				e.getStatusCode(),
				InternalApiTarget.AccountUri.GET_ACCOUNT.getPath(),
				e.getMessage(),
				e.getResponseBodyAsString(),
				e
			);
		} catch (Exception e) {
			// 기타 네트워크 오류 등
			log.error("[투자 실패] 계좌 서비스 통신 예외 - uri: {}, message: {}",
				InternalApiTarget.AccountUri.GET_ACCOUNT.getPath(),
				e.getMessage(),
				e
			);
		}
		investmentRepository.save(
			Investment.builder()
				.targetRate(requestDto.targetRate())
				.principal(requestDto.principal())
				.amount(requestDto.principal())
				.dueDate(TimeUtil.nowKst())
				.createdAt(Instant.from(LocalDateTime.now()))
				.build()
		);
	}
}

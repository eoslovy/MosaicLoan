package com.mosaic.investment.controller;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.core.util.TimeUtil;
import com.mosaic.investment.dto.InvestmentListResponse;
import com.mosaic.investment.dto.InvestmentSummaryResponse;
import com.mosaic.investment.dto.InvestmentTransactionResponse;
import com.mosaic.investment.dto.InvestmentTransactionSearchRequest;
import com.mosaic.investment.dto.RequestInvestmentDto;
import com.mosaic.investment.dto.InvestmentSummaryResponse;
import com.mosaic.investment.dto.InvestmentListResponse;
import com.mosaic.investment.dto.ProfitHistoryResponse;
import com.mosaic.investment.dto.RequestInvestmentDto;
import com.mosaic.investment.repository.InvestmentQueryRepository;
import com.mosaic.investment.service.InvestmentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("investments")
@Slf4j
public class InvestmentController {

	private final InvestmentService investmentService;
	private final InvestmentQueryRepository investmentQueryRepository;
	private final TimeUtil timeUtil;

	@PostMapping("")
	public ResponseEntity<Void> requestInvestment(@RequestBody RequestInvestmentDto requestDto,
		@RequestHeader("X-MEMBER-ID") Integer memberId, @RequestHeader("X-IS-BOT") Boolean isBot) throws
		JsonProcessingException {
		LocalDateTime now = timeUtil.now(isBot);
		log.info("[{}] - {}의 투자신청 요청 실행",now, memberId);
		investmentService.publishInvestmentRequest(requestDto, now, memberId, isBot);
		return ResponseEntity.accepted().build();
	}

	@GetMapping
	public ResponseEntity<Map<String, Object>> getInvestments(@RequestHeader("X-MEMBER-ID") Integer memberId) {
		try {
			Map<String, Object> response = investmentQueryRepository.findInvestmentsWithOverview(memberId);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			log.error("Error fetching investments: {}", e.getMessage(), e);
			return ResponseEntity.internalServerError().build();
		}
	}

	// 투자 요약 정보 조회 API
	@GetMapping("/summary")
	public ResponseEntity<InvestmentSummaryResponse> getInvestmentSummary(
		@RequestHeader("X-MEMBER-ID") Integer memberId) {
		try {
			InvestmentSummaryResponse response = investmentQueryRepository.getInvestmentSummary(memberId);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			log.error("Error fetching investment summary: {}", e.getMessage(), e);
			return ResponseEntity.internalServerError().build();
		}
	}

	// 최근 투자 목록 조회 API
	@GetMapping("/recent")
	public ResponseEntity<InvestmentListResponse> getRecentInvestments(@RequestHeader("X-MEMBER-ID") Integer memberId) {
		try {
			InvestmentListResponse response = investmentQueryRepository.getRecentInvestments(memberId);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			log.error("Error fetching recent investments: {}", e.getMessage(), e);
			return ResponseEntity.internalServerError().build();
		}
	}

	// 수익 내역 조회 API
	@GetMapping("/profits")
	public ResponseEntity<ProfitHistoryResponse> getProfitHistory(@RequestHeader("X-MEMBER-ID") Integer memberId) {
		try {
			ProfitHistoryResponse response = investmentQueryRepository.getProfitHistory(memberId);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			log.error("Error fetching profit history: {}", e.getMessage(), e);
			return ResponseEntity.internalServerError().build();
		}
	}

	@PostMapping("/transactions/search")
	public ResponseEntity<InvestmentTransactionResponse> getInvestmentTransactions(
		@RequestBody InvestmentTransactionSearchRequest request) {
		return ResponseEntity.ok(investmentQueryRepository.searchTransactions(request));
	}
}

package com.mosaic.investment.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.investment.dto.InvestmentTransactionResponse;
import com.mosaic.investment.dto.InvestmentTransactionSearchRequest;
import com.mosaic.investment.dto.InvestmentWithStatusDto;
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

    //TODO 투자하기
    @PostMapping("")
    public ResponseEntity<Void> requestInvestment(@RequestBody RequestInvestmentDto requestDto) throws
            JsonProcessingException {
        log.info("{}의 투자신청 요청 실행", requestDto.id());
        investmentService.publishInvestmentRequest(requestDto);
        return ResponseEntity.accepted().build();
    }

    //TODO 내 투자내역 확인
    // 헤더까보고 memberId 확인해서 내 투자 상품들 리스트로 다 가져오기
    @GetMapping("")
    public ResponseEntity<Map<String, List<InvestmentWithStatusDto>>> getInvestments(@RequestHeader("X-MEMBER-ID") Integer memberId) {
        List<InvestmentWithStatusDto> investments = investmentQueryRepository.findInvestmentsWithStatusDistribution(memberId);
        Map<String, List<InvestmentWithStatusDto>> response = Map.of("investments", investments);
        return ResponseEntity.ok(response);
    }

    //TODO 내 개별 투자의 거래내역 확인
    @GetMapping("/transactions/search")
    public ResponseEntity<InvestmentTransactionResponse> getInvestmentTransactions(
        @RequestBody InvestmentTransactionSearchRequest request) {
        return ResponseEntity.ok(investmentQueryRepository.searchTransactions(request));
    }




    //TODO 종료하고 계좌로 환급하기
    //TODO 돈 환급(스케쥴러)
    //scheduele: 돈 환급 계약 만료
    //approve: 계약이 완료되었는지 확인
    //error: 미상환 계약 여부 확인 및 자동 이전처리
    //pub: 계좌기준으로 kafka 이벤트 발행

    //sub: 계좌에 돈 입금 처리 완료 확인
    //approve: 계약 status 종료
}

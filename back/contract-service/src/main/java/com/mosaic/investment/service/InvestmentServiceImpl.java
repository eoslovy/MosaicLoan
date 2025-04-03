package com.mosaic.investment.service;

import com.mosaic.core.exception.InternalSystemException;
import com.mosaic.core.model.Investment;
import com.mosaic.investment.dto.RequestInvestmentDto;
import com.mosaic.investment.event.message.AccountTransactionPayload;
import com.mosaic.investment.event.producer.InvestmentKafkaProducer;
import com.mosaic.investment.repository.InvestmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class InvestmentServiceImpl implements InvestmentService {

    private final InvestmentRepository investmentRepository;
    private final InvestmentKafkaProducer investmentProducer;

    @Override
    public void publishInvestmentRequest(RequestInvestmentDto requestDto) throws
            InternalSystemException {
        //TODO 멱등성 : 시간기준 UUID 및 요청별 request막는 ttl 발행
        Integer idempotencyKey = requestDto.hashCode();
        Investment newInvestment = Investment.requestOnlyFormInvestment(requestDto);
        investmentRepository.save(newInvestment);
        AccountTransactionPayload requestEvent = AccountTransactionPayload.buildInvest(newInvestment);
        investmentProducer.sendInvestmentCreatedEvent(requestEvent);
    }


    @Override
    public void completeInvestmentRequest(AccountTransactionPayload completeInvestmentRequest) throws Exception {
        Optional<Investment> getNewInvestment = investmentRepository.findById(completeInvestmentRequest.targetId());
        if (getNewInvestment.isEmpty()) throw new Exception("해당하는 투자계좌 없음 에러");
        Investment newInvestment = getNewInvestment.get();
        newInvestment.completeRequest(completeInvestmentRequest);
        investmentProducer.sendInvestmentConfirmedEvent(completeInvestmentRequest);
    }
}

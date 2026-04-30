package com.SpicaLabs.tack.services;

import com.SpicaLabs.tack.Mapper.DtoMapper;
import com.SpicaLabs.tack.dto.request.PaymentReqDto;
import com.SpicaLabs.tack.dto.response.PaymentRespDto;
import com.SpicaLabs.tack.entity.Payment;
import com.SpicaLabs.tack.entity.Staff;
import com.SpicaLabs.tack.repository.PaymentRepo;
import com.SpicaLabs.tack.repository.StaffRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepo paymentRepo;
    private final DtoMapper dtoMapper;
    private final StaffRepo staffRepo;

    public PaymentRespDto makePayment(PaymentReqDto req) {
        Staff staff = staffRepo.findById(req.getStaffId())
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        Payment payment = Payment.builder()
                .staff(staff)
                .amount(req.getAmount())
                .paymentType(req.getType())
                .date(req.getDate())
                .build();

        Payment savedPayment = paymentRepo.save(payment);
        PaymentRespDto resp = dtoMapper.toPaymentRespDto(savedPayment);

        return resp;

    }


    public List<PaymentRespDto> getAllPaymentsByStaffId(Long staffId) {
        List<Payment> payments = paymentRepo.findByStaffId(staffId);
        return payments.stream()
                .map(dtoMapper::toPaymentRespDto)
                .toList();
    }
}

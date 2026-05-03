package com.SpicaLabs.tack.controller;

import com.SpicaLabs.tack.dto.request.PaymentReqDto;
import com.SpicaLabs.tack.dto.response.PaymentRespDto;
import com.SpicaLabs.tack.services.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("Tack/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/make")
    public ResponseEntity<PaymentRespDto> makePayment(@RequestBody PaymentReqDto req) {
        return ResponseEntity.ok(paymentService.makePayment(req));
    }

    @GetMapping("/staff/{staffId}")
    public ResponseEntity<List<PaymentRespDto>> getPaymentByStaffId(@PathVariable Long staffId) {
        return ResponseEntity.ok(paymentService.getAllPaymentsByStaffId(staffId));
    }
}

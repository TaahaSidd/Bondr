package com.SpicaLabs.tack.controller;

import com.SpicaLabs.tack.dto.request.OrderReqDto;
import com.SpicaLabs.tack.dto.response.OrderRespDto;
import com.SpicaLabs.tack.services.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("Tack/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<OrderRespDto> createOrder(@Valid @RequestBody OrderReqDto req) {
        return ResponseEntity.ok(orderService.createOrder(req));
    }

    @GetMapping("/all")
    public ResponseEntity<List<OrderRespDto>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

}

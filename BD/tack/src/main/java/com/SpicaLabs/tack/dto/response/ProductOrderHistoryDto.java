package com.SpicaLabs.tack.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductOrderHistoryDto {

    private Long orderId;

    private String customerName;

    private LocalDate orderDate;

    private BigDecimal quantity;
    private BigDecimal price;

}

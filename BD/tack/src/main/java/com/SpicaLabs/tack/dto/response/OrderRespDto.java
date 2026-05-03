package com.SpicaLabs.tack.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRespDto {

    private Long id;

    private String customerName;
    private LocalDate orderDate;

    private LocalDateTime createdAt;
    private Boolean isActive;

    private List<OrderItemRespDto> orderItems;

}

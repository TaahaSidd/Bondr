package com.SpicaLabs.tack.dto.response;

import com.SpicaLabs.tack.entity.enums.PaymentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRespDto {
    private Long id;
    private StaffRespDto staff;
    private BigDecimal amount;
    private PaymentType type;
    private LocalDate date;
}

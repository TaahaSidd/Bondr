package com.SpicaLabs.tack.dto.request;

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
public class PaymentReqDto {
    private Long staffId;
    private BigDecimal amount;
    private PaymentType type;
    private LocalDate date;
}

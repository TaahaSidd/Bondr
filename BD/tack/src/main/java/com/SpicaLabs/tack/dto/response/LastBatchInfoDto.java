package com.SpicaLabs.tack.dto.response;

import com.SpicaLabs.tack.entity.enums.ProductLength;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LastBatchInfoDto {

    private Long productId;

    private String productName;
    private ProductLength length;

    private BigDecimal lastBatchQuantity;
    private LocalDateTime lastBatchCreatedAt;


}

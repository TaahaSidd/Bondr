package com.SpicaLabs.tack.dto.response;

import com.SpicaLabs.tack.entity.enums.ProductLength;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TotalProductionDto {

    private Long productId;

    private String productName;
    private ProductLength length;

    private BigDecimal totalProduced;

}

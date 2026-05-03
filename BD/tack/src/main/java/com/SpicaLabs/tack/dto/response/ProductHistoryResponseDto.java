package com.SpicaLabs.tack.dto.response;

import com.SpicaLabs.tack.entity.enums.ProductLength;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductHistoryResponseDto {

    private Long productId;

    private String productName;
    private ProductLength length;

    private List<ProductOrderHistoryDto> recentOrders;

}

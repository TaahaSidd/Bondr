package com.SpicaLabs.tack.dto.response;

import com.SpicaLabs.tack.entity.enums.ProductLength;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductRespDto {

    private Long id;

    private String name; //7mm , 11mm etc.
    private ProductLength length;
    private String description;

    private Integer stockQuantity;
}

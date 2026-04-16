package com.SpicaLabs.tack.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRespDto {

    private Long id;

    private String name; //7mm , 11mm etc.
    private String description;

    private Integer stockQuantity;
}

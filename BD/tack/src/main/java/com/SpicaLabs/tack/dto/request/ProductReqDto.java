package com.SpicaLabs.tack.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductReqDto {

    private String name; //7mm , 11mm etc.
    private String description;

}

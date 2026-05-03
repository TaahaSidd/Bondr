package com.SpicaLabs.tack.dto.request;

import com.SpicaLabs.tack.entity.enums.ProductLength;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductReqDto {

    @NotBlank
    @Size(max = 50, message = "Name too long")
    private String name; //7mm , 11mm etc.

    @NotNull
    private ProductLength length;

    @NotBlank
    private String description;

}

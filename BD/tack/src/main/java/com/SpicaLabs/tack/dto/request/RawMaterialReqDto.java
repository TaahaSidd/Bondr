package com.SpicaLabs.tack.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RawMaterialReqDto {

    @NotBlank(message = "Name required")
    @Size(max = 100, message = "Name too long")
    private String name;

    @NotNull
    @Positive(message = "Quantity must be positive")
    private Double quantityKg;

    @NotNull
    @Positive(message = "Cost must be positive")
    @DecimalMax("1000.0")
    private Double costPerKg;

    @NotBlank(message = "Supplier required")
    private String supplier;

    private LocalDateTime createdAt;
}
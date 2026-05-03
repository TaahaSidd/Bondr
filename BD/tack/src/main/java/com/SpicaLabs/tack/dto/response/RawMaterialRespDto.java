package com.SpicaLabs.tack.dto.response;

import java.time.LocalDateTime;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RawMaterialRespDto {

    private Long id;

    private String name;

    private Double quantityKg;

    private Double costPerKg;

    private String supplier;

    private LocalDateTime createdAt;
}

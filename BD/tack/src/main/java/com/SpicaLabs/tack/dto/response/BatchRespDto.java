package com.SpicaLabs.tack.dto.response;

import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchRespDto {

    private Long id;

    private Double beadsUsedKg;
    private Double sticksProduced;
    private Double wastageKg;

    private LocalDate date;

    private Long rawMaterialId;
}

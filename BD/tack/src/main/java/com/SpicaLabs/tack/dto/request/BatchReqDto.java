package com.SpicaLabs.tack.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.NotFound;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchReqDto {

    @NotNull
    @Positive(message = "Beads used must be positive")
    private Double beadsUsedKg;

    @NotNull
    @Positive(message = "Sticks Produced must be positive")
    private Double sticksProduced;

    @NotNull
    @Positive(message = "Waste must be positive")
    private Double wastageKg;

    @NotNull
    @PastOrPresent(message = "Date cannot be in future")
    private LocalDate date;

    @NotNull
    @Positive(message = "Raw material ID must exist")
    private Long rawMaterialId;

    @NotNull
    @Positive(message = "Product ID must exist")
    private Long productId;
}

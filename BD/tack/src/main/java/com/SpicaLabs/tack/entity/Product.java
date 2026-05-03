package com.SpicaLabs.tack.entity;

import com.SpicaLabs.tack.entity.enums.ProductLength;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; //7mm , 11mm etc.
    private String description;

    @Enumerated(EnumType.STRING)
    private ProductLength length; //5.5, 6, 6.5 etc.

    @Builder.Default
    private Integer stockQuantity = 0;
}

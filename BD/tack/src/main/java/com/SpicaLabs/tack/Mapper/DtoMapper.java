package com.SpicaLabs.tack.Mapper;

import com.SpicaLabs.tack.dto.response.BatchRespDto;
import com.SpicaLabs.tack.dto.response.ProductRespDto;
import com.SpicaLabs.tack.dto.response.RawMaterialRespDto;
import com.SpicaLabs.tack.entity.Batch;
import com.SpicaLabs.tack.entity.Product;
import com.SpicaLabs.tack.entity.RawMaterial;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DtoMapper {

    // Dto mapper for RawMaterial
    public RawMaterialRespDto toRawMaterialRespDto(RawMaterial rawMaterial) {
        RawMaterialRespDto dto = new RawMaterialRespDto();

        dto.setId(rawMaterial.getId());
        dto.setName(rawMaterial.getName());
        dto.setQuantityKg(rawMaterial.getQuantityKg());
        dto.setCostPerKg(rawMaterial.getCostPerKg());

        dto.setSupplier(rawMaterial.getSupplier());
        dto.setCreatedAt(rawMaterial.getCreatedAt());

        return dto;
    }

    //Dto mapper for Batch
    public BatchRespDto toBatchRespDto(Batch batch) {
        BatchRespDto dto = new BatchRespDto();

        dto.setId(batch.getId());
        dto.setBeadsUsedKg(batch.getBeadsUsedKg());
        dto.setSticksProduced(batch.getSticksProduced());
        dto.setWastageKg(batch.getWastageKg());
        dto.setDate(batch.getDate());

        dto.setRawMaterialId(batch.getRawMaterial().getId());

        return dto;
    }

    //Mapper for Product

    public ProductRespDto toProductRespDto(Product product) {
        ProductRespDto dto = new ProductRespDto();

        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        return dto;
    }
}

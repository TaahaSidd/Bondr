package com.SpicaLabs.tack.services;

import com.SpicaLabs.tack.dto.request.RawMaterialReqDto;
import com.SpicaLabs.tack.dto.response.RawMaterialRespDto;
import com.SpicaLabs.tack.Mapper.DtoMapper;
import com.SpicaLabs.tack.entity.RawMaterial;
import com.SpicaLabs.tack.repository.RawMaterialRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RawMaterialService {

    private final RawMaterialRepo rawMaterialRepo;
    private final DtoMapper dtoMapper;

    public RawMaterialRespDto addRawMaterial(RawMaterialReqDto req) {

        RawMaterial rawMaterial = new RawMaterial();

        rawMaterial.setName(req.getName());
        rawMaterial.setQuantityKg(req.getQuantityKg());
        rawMaterial.setCostPerKg(req.getCostPerKg());
        rawMaterial.setSupplier(req.getSupplier());
        rawMaterial.setCreatedAt(req.getCreatedAt());

        RawMaterial savedRawMaterial = rawMaterialRepo.save(rawMaterial);

        RawMaterialRespDto resp = dtoMapper.toRawMaterialRespDto(savedRawMaterial);
        return resp;
    }

    public List<RawMaterialRespDto> getAllRawMaterials() {
        List<RawMaterial> rawMaterials = rawMaterialRepo.findAll();

        return rawMaterials.stream()
                .map(dtoMapper::toRawMaterialRespDto)
                .collect(Collectors.toList());
    }

}

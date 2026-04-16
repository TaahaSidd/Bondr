package com.SpicaLabs.tack.services;

import com.SpicaLabs.tack.Mapper.DtoMapper;
import com.SpicaLabs.tack.dto.request.BatchReqDto;
import com.SpicaLabs.tack.dto.response.BatchRespDto;
import com.SpicaLabs.tack.entity.Batch;
import com.SpicaLabs.tack.entity.RawMaterial;
import com.SpicaLabs.tack.repository.BatchRepo;
import com.SpicaLabs.tack.repository.RawMaterialRepo;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BatchService {

    private final RawMaterialRepo rawMaterialRepo;
    private final BatchRepo batchRepo;
    private final DtoMapper dtoMapper;

    @Transactional
    public BatchRespDto createBatch(BatchReqDto req) {

        //finding raw material
        RawMaterial rawMaterial = rawMaterialRepo
                .findById(req.getRawMaterialId())
                .orElseThrow(() -> new EntityNotFoundException("Raw Material Id not found"));

        //Validation
        if (rawMaterial.getQuantityKg() < req.getBeadsUsedKg()) {
            throw new IllegalArgumentException(
                    String.format("Insufficient stock! Need %.2fkg, available %.2fkg",
                            req.getBeadsUsedKg(), rawMaterial.getQuantityKg())
            );
        }

        //Deduction of Stock
        rawMaterial.setQuantityKg(
                rawMaterial.getQuantityKg() - req.getBeadsUsedKg()
        );
        rawMaterialRepo.save(rawMaterial);

        Batch batch = Batch.builder()
                .beadsUsedKg(req.getBeadsUsedKg())
                .sticksProduced(req.getSticksProduced())
                .wastageKg(req.getWastageKg())
                .date(req.getDate())
                .rawMaterial(rawMaterial)
                .build();

        Batch savedBatch = batchRepo.save(batch);
        BatchRespDto resp = dtoMapper.toBatchRespDto(savedBatch);

        return resp;
    }

    public List<BatchRespDto> getAllBatches() {
        List<Batch> batches = batchRepo.findAll();

        return batches.stream()
                .map(dtoMapper::toBatchRespDto)
                .collect(Collectors.toList());
    }

}

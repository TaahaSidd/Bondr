package com.SpicaLabs.tack.controller;

import com.SpicaLabs.tack.dto.request.BatchReqDto;
import com.SpicaLabs.tack.dto.response.BatchRespDto;
import com.SpicaLabs.tack.services.BatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("Tack/batch")
@RequiredArgsConstructor
public class BatchController {

    private final BatchService batchService;

    @PostMapping("/create")
    public ResponseEntity<BatchRespDto> createBatch(@Valid @RequestBody BatchReqDto req) {
        return ResponseEntity.ok(batchService.createBatch(req));
    }

    @GetMapping("/all")
    public ResponseEntity<List<BatchRespDto>> getAllBatches() {
        return ResponseEntity.ok(batchService.getAllBatches());
    }
}

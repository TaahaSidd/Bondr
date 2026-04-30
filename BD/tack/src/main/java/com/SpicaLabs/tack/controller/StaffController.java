package com.SpicaLabs.tack.controller;

import com.SpicaLabs.tack.dto.request.StaffReqDto;
import com.SpicaLabs.tack.dto.response.StaffRespDto;
import com.SpicaLabs.tack.services.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("Tack/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @PostMapping("/add")
    public ResponseEntity<StaffRespDto> addStaff(@RequestBody StaffReqDto req) {
        return ResponseEntity.ok(staffService.addStaff(req));
    }

    @GetMapping("/all")
    public ResponseEntity<List<StaffRespDto>> getAllStaff() {
        return ResponseEntity.ok(staffService.getAllStaff());
    }
}

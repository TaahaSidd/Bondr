package com.SpicaLabs.tack.controller;

import com.SpicaLabs.tack.dto.request.AttendanceReqDto;
import com.SpicaLabs.tack.dto.response.AttendanceRespDto;
import com.SpicaLabs.tack.services.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("Tack/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/mark")
    public ResponseEntity<AttendanceRespDto> markAttendance(@RequestBody AttendanceReqDto req) {
        return ResponseEntity.ok(attendanceService.addAttendance(req));
    }

    @GetMapping("/staff/{staffId}")
    public ResponseEntity<List<AttendanceRespDto>> getAttendanceById(@PathVariable Long staffId) {
        return ResponseEntity.ok(attendanceService.getAllAttendanceById(staffId));
    }
}

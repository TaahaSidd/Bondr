package com.SpicaLabs.tack.services;

import com.SpicaLabs.tack.Mapper.DtoMapper;
import com.SpicaLabs.tack.dto.request.AttendanceReqDto;
import com.SpicaLabs.tack.dto.response.AttendanceRespDto;
import com.SpicaLabs.tack.entity.Attendance;
import com.SpicaLabs.tack.entity.Staff;
import com.SpicaLabs.tack.repository.AttendanceRepo;
import com.SpicaLabs.tack.repository.StaffRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepo attendanceRepo;
    private final DtoMapper dtoMapper;
    private final StaffRepo staffRepo;

    public AttendanceRespDto addAttendance(AttendanceReqDto req) {
        Staff staff = staffRepo.findById(req.getStaffId())
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        Attendance attendance = Attendance.builder()
                .staff(staff)
                .date(req.getDate())
                .status(req.getStatus())
                .build();

        Attendance saved = attendanceRepo.save(attendance);
        AttendanceRespDto resp = dtoMapper.toAttendanceRespDto(saved);

        return resp;
    }

    public List<AttendanceRespDto> getAllAttendanceById(Long staffId) {
        List<Attendance> attendances = attendanceRepo.findByStaffId(staffId);
        return attendances.stream()
                .map(dtoMapper::toAttendanceRespDto)
                .toList();
    }
}

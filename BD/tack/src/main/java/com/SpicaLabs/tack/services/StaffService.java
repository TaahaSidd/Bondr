package com.SpicaLabs.tack.services;

import com.SpicaLabs.tack.Mapper.DtoMapper;
import com.SpicaLabs.tack.dto.request.StaffReqDto;
import com.SpicaLabs.tack.dto.response.StaffRespDto;
import com.SpicaLabs.tack.entity.Staff;
import com.SpicaLabs.tack.repository.StaffRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final StaffRepo staffRepo;
    private final DtoMapper dtoMapper;

    public StaffRespDto addStaff(StaffReqDto req) {

        Staff staff = Staff.builder()
                .name(req.getName())
                .build();

        Staff savedStaff = staffRepo.save(staff);
        StaffRespDto resp = dtoMapper.toStaffRespDto(savedStaff);

        return resp;
    }

    public List<StaffRespDto> getAllStaff() {
        List<Staff> staffList = staffRepo.findAll();

        return staffList.stream()
                .map(dtoMapper::toStaffRespDto)
                .toList();   //Java 16+ instead of Collectors.toList() - used toList()
    }
}

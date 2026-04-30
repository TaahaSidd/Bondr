package com.SpicaLabs.tack.dto.request;

import com.SpicaLabs.tack.entity.enums.StaffStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceReqDto {

    private Long staffId;
    private LocalDate date;
    private StaffStatus status;
}

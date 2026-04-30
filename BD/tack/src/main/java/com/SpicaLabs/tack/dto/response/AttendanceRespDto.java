package com.SpicaLabs.tack.dto.response;

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
public class AttendanceRespDto {

    private Long id;

    private StaffRespDto staff;
    private StaffStatus status;

    private LocalDate date;
}

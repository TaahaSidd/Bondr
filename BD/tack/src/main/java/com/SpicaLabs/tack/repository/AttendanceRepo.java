package com.SpicaLabs.tack.repository;

import com.SpicaLabs.tack.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AttendanceRepo extends JpaRepository<Attendance, Long> {

    @Query("SELECT a FROM Attendance a WHERE a.staff.id = :staffId")
    List<Attendance> findByStaffId(@Param("staffId") Long staffId);
}

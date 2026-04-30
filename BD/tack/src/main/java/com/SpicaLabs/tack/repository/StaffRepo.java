package com.SpicaLabs.tack.repository;

import com.SpicaLabs.tack.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffRepo extends JpaRepository<Staff, Long> {
}

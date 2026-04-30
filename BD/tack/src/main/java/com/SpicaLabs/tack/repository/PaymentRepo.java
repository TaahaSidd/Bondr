package com.SpicaLabs.tack.repository;

import com.SpicaLabs.tack.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PaymentRepo extends JpaRepository<Payment, Long> {
    @Query("SELECT p FROM Payment p WHERE p.staff.id = :staffId")
    List<Payment> findByStaffId(@Param("staffId") Long staffId);

}

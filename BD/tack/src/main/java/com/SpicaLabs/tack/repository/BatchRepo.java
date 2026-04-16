package com.SpicaLabs.tack.repository;

import com.SpicaLabs.tack.entity.Batch;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BatchRepo extends JpaRepository<Batch, Long> {
}

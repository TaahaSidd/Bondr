package com.SpicaLabs.tack.repository;

import com.SpicaLabs.tack.entity.Batch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface BatchRepo extends JpaRepository<Batch, Long> {

    @Query("SELECT b FROM Batch b WHERE b.product.id = :productId ORDER BY b.date DESC")
    List<Batch> findByProductIdOrderByDateDesc(@Param("productId") Long productId);

    @Query("SELECT SUM(b.sticksProduced) FROM Batch b WHERE b.product.id = :productId")
    BigDecimal sumSticksProducedByProductId(@Param("productId") Long productId);
}

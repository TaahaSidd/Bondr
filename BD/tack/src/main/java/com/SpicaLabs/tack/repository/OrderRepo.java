package com.SpicaLabs.tack.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.SpicaLabs.tack.entity.Order;

public interface OrderRepo extends JpaRepository<Order, Long> {

    @Query("Select o from Order o where o.isActive = true")
    List<Order> findAllActiveOrders();

    @Query("Select o from Order o where o.isActive = true " + "and o.createdAt >= :cutoff")
    List<Order> findRecentActiveOrders(@Param("cutoff") LocalDateTime cutoff);
}

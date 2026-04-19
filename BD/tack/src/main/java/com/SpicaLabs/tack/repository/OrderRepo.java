package com.SpicaLabs.tack.repository;

import com.SpicaLabs.tack.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepo extends JpaRepository<Order, Long> {
}

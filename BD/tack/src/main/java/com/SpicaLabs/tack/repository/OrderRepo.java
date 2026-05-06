package com.SpicaLabs.tack.repository;

import java.time.LocalDateTime;
import java.util.List;

import com.SpicaLabs.tack.dto.response.ProductOrderHistoryDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.SpicaLabs.tack.entity.Order;

public interface OrderRepo extends JpaRepository<Order, Long> {

    @Query("Select o from Order o where o.isActive = true")
    List<Order> findAllActiveOrders();

    @Query("Select o from Order o where o.isActive = true " + "and o.createdAt >= :cutoff")
    List<Order> findRecentActiveOrders(@Param("cutoff") LocalDateTime cutoff);

    @Query("""
            SELECT new com.SpicaLabs.tack.dto.response.ProductOrderHistoryDto(
                o.id,
                o.customerName,
                o.orderDate,
                oi.quantity,
                oi.price
            )
            FROM OrderItem oi
            JOIN oi.order o
            WHERE oi.product.id = :productId
                AND o.createdAt >= :cutoff
            ORDER BY o.createdAt DESC
            """)
    List<ProductOrderHistoryDto> findRecentOrdersForProduct(
            @Param("productId") Long productId,
            @Param("cutoff") LocalDateTime cutoff);
}

package com.SpicaLabs.tack.Mapper;

import com.SpicaLabs.tack.dto.response.*;
import com.SpicaLabs.tack.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class DtoMapper {

    // Dto mapper for RawMaterial
    public RawMaterialRespDto toRawMaterialRespDto(RawMaterial rawMaterial) {
        return RawMaterialRespDto.builder()
                .id(rawMaterial.getId())
                .name(rawMaterial.getName())
                .quantityKg(rawMaterial.getQuantityKg())
                .costPerKg(rawMaterial.getCostPerKg())
                .supplier(rawMaterial.getSupplier())
                .createdAt(rawMaterial.getCreatedAt())
                .build();
    }

    // Dto mapper for Batch
    public BatchRespDto toBatchRespDto(Batch batch) {
        return BatchRespDto.builder()
                .id(batch.getId())
                .beadsUsedKg(batch.getBeadsUsedKg())
                .sticksProduced(batch.getSticksProduced())
                .wastageKg(batch.getWastageKg())
                .date(batch.getDate())
                .rawMaterialId(batch.getRawMaterial().getId())
                .build();
    }

    // Mapper for Product
    public ProductRespDto toProductRespDto(Product product) {
        return ProductRespDto.builder()
                .id(product.getId())
                .name(product.getName())
                .length(product.getLength())
                .description(product.getDescription())
                .stockQuantity(product.getStockQuantity())
                .build();
    }

    // Mapper for Order
    public OrderRespDto toOrderRespDto(Order order) {
        List<OrderItemRespDto> itemDtos = order.getOrderItems().stream()
                .map(this::toOrderItemRespDto)
                .collect(Collectors.toList());

        return OrderRespDto.builder()
                .id(order.getId())
                .customerName(order.getCustomerName())
                .orderDate(order.getOrderDate())
                .createdAt(order.getCreatedAt())
                .isActive(order.getIsActive())
                .orderItems(itemDtos)
                .build();
    }

    // Mapper for OrderItem
    public OrderItemRespDto toOrderItemRespDto(OrderItem orderItem) {
        return OrderItemRespDto.builder()
                .id(orderItem.getId())
                .productId(orderItem.getProduct().getId())
                .productName(orderItem.getProduct().getName())
                .quantity(orderItem.getQuantity())
                .price(orderItem.getPrice())
                .build();
    }

    //Mapper for Staff
    public StaffRespDto toStaffRespDto(Staff staff) {
        return StaffRespDto.builder()
                .id(staff.getId())
                .name(staff.getName())
                .build();
    }

    //Mapper for Attendance
    public AttendanceRespDto toAttendanceRespDto(Attendance attendance) {
        return AttendanceRespDto.builder()
                .id(attendance.getId())
                .staff(toStaffRespDto(attendance.getStaff()))
                .status(attendance.getStatus())
                .date(attendance.getDate())
                .build();
    }

    //Mapper for Payments
    public PaymentRespDto toPaymentRespDto(Payment payment) {
        return PaymentRespDto.builder()
                .id(payment.getId())
                .staff(toStaffRespDto(payment.getStaff()))
                .amount(payment.getAmount())
                .type(payment.getPaymentType())
                .date(payment.getDate())
                .build();
    }
}
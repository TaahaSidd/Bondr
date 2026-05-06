package com.SpicaLabs.tack.services;

import com.SpicaLabs.tack.Mapper.DtoMapper;
import com.SpicaLabs.tack.dto.request.ProductReqDto;
import com.SpicaLabs.tack.dto.response.*;
import com.SpicaLabs.tack.entity.Batch;
import com.SpicaLabs.tack.entity.Product;
import com.SpicaLabs.tack.repository.BatchRepo;
import com.SpicaLabs.tack.repository.OrderRepo;
import com.SpicaLabs.tack.repository.ProductRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepo productRepo;
    private final BatchRepo batchRepo;
    private final OrderRepo orderRepo;
    private final DtoMapper dtoMapper;

    public ProductRespDto createProduct(ProductReqDto req) {

        Product product = Product.builder()
                .name(req.getName())
                .description(req.getDescription())
                .length(req.getLength())
                .build();

        Product savedProduct = productRepo.save(product);
        ProductRespDto resp = dtoMapper.toProductRespDto(savedProduct);

        return resp;
    }

    public List<ProductRespDto> getAllProducts() {
        List<Product> products = productRepo.findAll();

        return products.stream()
                .map(dtoMapper::toProductRespDto)
                .collect(Collectors.toList());
    }

    public ProductRespDto getProductById(Long id) {
        Product product = productRepo.findById(id).orElseThrow(
                () -> new RuntimeException("Product with id: " + id + " not found")
        );

        return dtoMapper.toProductRespDto(product);
    }

    //Method for getting Last Batch
    public LastBatchInfoDto getLastBatchInfo(Long productId) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product with id: " + productId + "not found"));

        List<Batch> batches = batchRepo.findByProductIdOrderByDateDesc(productId);

        Batch latestBatch = batches.isEmpty() ? null : batches.get(0);

        return LastBatchInfoDto.builder()
                .productId(productId)
                .productName(product.getName())
                .length(product.getLength())
                .lastBatchQuantity(
                        latestBatch != null ? BigDecimal.valueOf(latestBatch.getSticksProduced()) : null
                )
                .lastBatchCreatedAt(
                        latestBatch != null ? latestBatch.getDate().atStartOfDay() : null
                )
                .build();
    }

    //Method for getting Total Production
    public TotalProductionDto getTotalProduction(Long productId) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product with id: " + productId + "not found"));

        BigDecimal total = batchRepo.sumSticksProducedByProductId(productId);

        return TotalProductionDto.builder()
                .productId(productId)
                .productName(product.getName())
                .length(product.getLength())
                .totalProduced(total != null ? total : BigDecimal.ZERO)
                .build();
    }

    //Method for getting Recent Order History
    public ProductHistoryResponseDto  getProductHistory(
            Long productId,
            Integer days,
            Integer limit) {

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product with id:" + productId + "Not Found"));

        LocalDateTime cutoff = LocalDateTime.now().minusDays(days);

        List<ProductOrderHistoryDto> orders = orderRepo.findRecentOrdersForProduct(productId, cutoff);

        if (orders.size() > limit) {
            orders = orders.subList(0, limit);
        }

        return ProductHistoryResponseDto.builder()
                .productId(product.getId())
                .productName(product.getName())
                .length(product.getLength())
                .recentOrders(orders)
                .build();
    }
}

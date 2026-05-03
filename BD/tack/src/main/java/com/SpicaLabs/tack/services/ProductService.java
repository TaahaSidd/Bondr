package com.SpicaLabs.tack.services;

import com.SpicaLabs.tack.Mapper.DtoMapper;
import com.SpicaLabs.tack.dto.request.ProductReqDto;
import com.SpicaLabs.tack.dto.response.ProductRespDto;
import com.SpicaLabs.tack.entity.Product;
import com.SpicaLabs.tack.repository.ProductRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepo productRepo;
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
}

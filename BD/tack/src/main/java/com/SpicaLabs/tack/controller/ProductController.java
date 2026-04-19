package com.SpicaLabs.tack.controller;

import com.SpicaLabs.tack.dto.request.ProductReqDto;
import com.SpicaLabs.tack.dto.response.ProductRespDto;
import com.SpicaLabs.tack.services.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Tack/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping("/create")
    public ResponseEntity<ProductRespDto> createProduct(@Valid @RequestBody ProductReqDto req) {
        return ResponseEntity.ok(productService.createProduct(req));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ProductRespDto>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/product/{id}")
    public ResponseEntity<ProductRespDto> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }
}

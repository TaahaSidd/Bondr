package com.SpicaLabs.tack.repository;

import com.SpicaLabs.tack.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepo extends JpaRepository<Product, Long> {
}

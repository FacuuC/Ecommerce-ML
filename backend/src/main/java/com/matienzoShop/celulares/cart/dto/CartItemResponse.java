package com.matienzoShop.celulares.cart.dto;

import java.math.BigDecimal;

public record CartItemResponse(
        Long itemId,
        Long productId,
        String productModel,
        String productBrand,
        Integer quantity,
        BigDecimal price
) {
}

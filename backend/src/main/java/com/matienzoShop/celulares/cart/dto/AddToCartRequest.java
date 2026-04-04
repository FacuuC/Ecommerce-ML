package com.matienzoShop.celulares.cart.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record AddToCartRequest(
        @NotNull Long productId,
        @NotNull @Min(1) Integer quantity
        ){}

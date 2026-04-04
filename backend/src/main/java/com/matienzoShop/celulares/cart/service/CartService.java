package com.matienzoShop.celulares.cart.service;

import com.matienzoShop.celulares.cart.dto.AddToCartRequest;
import com.matienzoShop.celulares.cart.dto.CartResponse;
import com.matienzoShop.celulares.cart.model.Cart;

import java.math.BigDecimal;

public interface CartService {

    CartResponse addToCart (Long productId, Integer quantity);
    CartResponse getCart ();
    void removeFromCartByProductId(Long productId);
    CartResponse updateItemQuantity(Long itemId, Integer quantity);
    CartResponse removeItem(Long itemId);
    CartResponse checkout(String sessionId);
    void clearCart();
}

package com.matienzoShop.celulares.cart.repository;

import com.matienzoShop.celulares.cart.model.Cart;
import com.matienzoShop.celulares.cart.model.CartItem;
import com.matienzoShop.celulares.celular.model.Celular;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);

}

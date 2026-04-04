package com.matienzoShop.celulares.cart.repository;

import com.matienzoShop.celulares.cart.model.Cart;
import com.matienzoShop.celulares.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser (User user);
}

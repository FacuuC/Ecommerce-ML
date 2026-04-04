package com.matienzoShop.celulares.cart.controller;

import com.matienzoShop.celulares.cart.dto.CartResponse;
import com.matienzoShop.celulares.cart.dto.UpdateCartItemRequest;
import com.matienzoShop.celulares.cart.service.CartService;
import com.matienzoShop.celulares.cart.dto.AddToCartRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController (CartService cartService){
        this.cartService = cartService;
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addToCart (@Valid @RequestBody AddToCartRequest req){
        return ResponseEntity.ok(cartService.addToCart(req.productId(), req.quantity()));
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart() {
        return ResponseEntity.ok(cartService.getCart());
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> updateCartQuantity (
            @PathVariable Long itemId,
            @RequestBody UpdateCartItemRequest req){
        CartResponse response = cartService.updateItemQuantity(itemId, req.quantity());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("items/{itemId}")
    public ResponseEntity<CartResponse> removeItem (@PathVariable Long itemId){
        return ResponseEntity.ok(cartService.removeItem(itemId));
    }

    @PostMapping("/checkout")
    public ResponseEntity<CartResponse> checkout(@RequestBody String sessionId){
        CartResponse response = cartService.checkout(sessionId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart (){
        cartService.clearCart();
        return ResponseEntity.ok().build();
    }
}

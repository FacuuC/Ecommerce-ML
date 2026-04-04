package com.matienzoShop.celulares.cart.service;

import com.matienzoShop.celulares.cart.dto.CartItemResponse;
import com.matienzoShop.celulares.cart.dto.CartResponse;
import com.matienzoShop.celulares.cart.model.Cart;
import com.matienzoShop.celulares.cart.model.CartItem;
import com.matienzoShop.celulares.cart.repository.CartItemRepository;
import com.matienzoShop.celulares.cart.repository.CartRepository;
import com.matienzoShop.celulares.celular.model.Celular;
import com.matienzoShop.celulares.celular.repository.CelularRepository;
import com.matienzoShop.celulares.events.dto.EventRequestDTO;
import com.matienzoShop.celulares.events.model.EventType;
import com.matienzoShop.celulares.events.service.EventService;
import com.matienzoShop.celulares.security.SecurityUtils;
import com.matienzoShop.celulares.user.model.User;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CelularRepository celularRepository;
    private final SecurityUtils securityUtils;
    private final EventService eventService;

    public CartServiceImpl(CartRepository cartRepository,
                           CartItemRepository cartItemRepository,
                           CelularRepository celularRepository,
                           SecurityUtils securityUtils,
                           EventService eventService
                           ) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.celularRepository = celularRepository;
        this.securityUtils = securityUtils;
        this.eventService = eventService;
    }


    @Override
    public CartResponse addToCart(Long productId, Integer quantity) {

        Cart cart = getOrCreateForCurrentUser();

        Celular product = celularRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        CartItem item = cartItemRepository
                .findByCartIdAndProductId(cart.getId(), productId)
                .orElseGet(() -> createCartItem(cart, product));

        item.setQuantity(item.getQuantity() + quantity);
        item.setPrice(product.getPrecio());

        cartItemRepository.save(item);
        return mapToCartResponse(cart);
    }

    @Override
    public CartResponse getCart (){
        Cart cart = getOrCreateForCurrentUser();
        return mapToCartResponse(cart);
    }

    @Override
    public void removeFromCartByProductId (Long productId){
        Cart cart = getCartForCurrentUser();
        cart.removeItemByProductId(productId);
        cartRepository.save(cart);

    }

    @Override
    public CartResponse updateItemQuantity (Long itemId, Integer quantity) {
        User user = securityUtils.getAuthenticatedUser();
        CartItem item = getCartItemForCurrentUser(itemId);

        if(!item.getCart().getUser().getId().equals(user.getId())){
            throw new RuntimeException("No autorizado");
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);

        Cart cart = item.getCart();
        return mapToCartResponse(cart);
    }

    @Override
    public CartResponse removeItem (Long itemId){

        User user = securityUtils.getAuthenticatedUser();
        CartItem item= getCartItemForCurrentUser(itemId);

        if(!item.getCart().getUser().getId().equals(user.getId())){
            throw new RuntimeException("No autorizado");
        }

        Cart cart = item.getCart();
        cart.getItems().remove(item);
        return mapToCartResponse(cart);
    }

    @Override
    public CartResponse checkout(String sessionId){

        Cart cart = getCartForCurrentUser();

        if(cart.getItems().isEmpty()){
            throw new RuntimeException("Carrito vacío");
        }

        BigDecimal total = cart.getItems().stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<Map<String, Object>> itemsMetadata = cart.getItems().stream()
                .map(item -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("productId", item.getProduct().getId());
                    map.put("quantity", item.getQuantity());
                    map.put("price", item.getPrice());
                    return map;
                })
                .toList();

        Map<String, Object> metadata = Map.of(
                "cartId", cart.getId(),
                "total", total,
                "currency", "ARS",
                "items", itemsMetadata
        );

        EventRequestDTO request = EventRequestDTO.builder()
                .eventType(EventType.PURCHASE)
                .productId(null)
                .metadata(metadata)
                .sessionId(sessionId)
                .build();

        System.out.println(request);

        eventService.registerEvent(request);
        cart.getItems().clear();
        cartRepository.save(cart);
        return mapToCartResponse(cart);
    }

    @Override
    public void clearCart() {
        Cart cart = getCartForCurrentUser();

        cart.getItems().clear();
        cartRepository.save(cart);
    }










    private Cart getOrCreateForCurrentUser(){
        User user = securityUtils.getAuthenticatedUser();

        return cartRepository.findByUser(user)
                .orElseGet(() -> createCart(user));
    }

    private Cart getCartForCurrentUser(){
        User user = securityUtils.getAuthenticatedUser();

        return cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado"));
    }

    private CartItem getCartItemForCurrentUser(Long itemId){
        User user = securityUtils.getAuthenticatedUser();

        return cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item no encontrado"));
    }

    private CartResponse mapToCartResponse (Cart cart) {

        List<CartItemResponse> items = cart.getItems().stream()
                .map(item -> new CartItemResponse(
                        item.getId(),
                        item.getProduct().getId(),
                        item.getProduct().getModelo(),
                        item.getProduct().getMarca(),
                        item.getQuantity(),
                        item.getPrice()
                ))
                .toList();

        BigDecimal total = items.stream()
                .map(i -> {
                    BigDecimal price = i.price() != null ? i.price() : BigDecimal.ZERO;
                    return price.multiply(BigDecimal.valueOf(i.quantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartResponse(cart.getId(), items, total);
    }

    private Cart createCart(User user){
        Cart cart = new Cart();
        cart.setUser(user);
        return cartRepository.save(cart);
    }

    private CartItem createCartItem (Cart cart, Celular product){
        CartItem newItem = new CartItem();
        newItem.setCart(cart);
        newItem.setProduct(product);
        newItem.setQuantity(0);
        newItem.setPrice(product.getPrecio());
        return newItem;
    }
}

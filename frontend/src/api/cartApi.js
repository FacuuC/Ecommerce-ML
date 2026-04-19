import { privateApi } from "./privateApi"

export const addToCartRequest = (productId, quantity) => {
    return privateApi.post("/cart/items", { productId, quantity })
}

export const getCartRequest = () => {
    return privateApi.get("/cart")
}

export const removeFromCartRequest = (itemId) => {
    return privateApi.delete(`/cart/items/${itemId}`)
}

export const updateCartItemRequest = (itemId, quantity) => {
    return privateApi.put(`/cart/items/${itemId}`, { quantity })
}

export const checkoutRequest = (sessionId) =>
    privateApi.post("/cart/checkout", { sessionId })

export const clearCartRequest = () => 
    privateApi.delete("/cart/clear")


import axios from "axios";

const cartClient = axios.create({
    baseURL: 'http://localhost:8080/cart'
})  

cartClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization= `Bearer ${token}`
    }
    return config
})

export const addToCartRequest = async (productId, quantity) => {
    return cartClient.post("/items", { productId, quantity })
}

export const getCartRequest = async () => {
    return cartClient.get()
}

export const removeFromCartRequest = async (itemId) => {
    return cartClient.delete(`/items/${itemId}`)
}

export const updateCartItemRequest = async (itemId, quantity) => {
    return cartClient.put(`/items/${itemId}`, { quantity })
}

export const checkoutRequest = async () =>
    cartClient.post("/checkout")
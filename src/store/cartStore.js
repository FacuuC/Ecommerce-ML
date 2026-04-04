import { create } from "zustand";
import { addToCartRequest, clearCartRequest } from "../api/cartApi";
import { trackEvent } from "../services/trackingService";
import { getCartRequest } from "../api/cartApi";
import { removeFromCartRequest } from "../api/cartApi";
import { updateCartItemRequest } from "../api/cartApi";
import { checkoutRequest } from "../api/cartApi";
import { useSessionStore } from "./sessionStore";

export const useCartStore = create((set, get) => ({
    items: [],
    total: 0,
    loading: false,
    error: null,
    hydrated: false,


    fetchCart: async () => {
        set({ loading: true, error: null })

        try {
            const res = await getCartRequest()

            set({ 
                items: res.data.items,
                total: res.data.total,
                hydrated: true
            })
        } catch (error) {
            console.error("Error fetching cart:", error)
            set({ error: 'Error al obtener el carrito' })
        } finally {
            set({ loading: false })
        }
    },


    addToCart: async (productId, quantity) => {
        set({ loading: true, error: null })

        try {
            const res = await addToCartRequest(productId, quantity)

            set({
                items: res.data.items,
                total: res.data.total,
            })

            trackEvent("ADD_TO_CART", productId, {
                quantity,
                price: res.data.price,
                currency: "ARS"
            })

            return true

        } catch (error) {
            console.log("Error en addToCart:", error)
            set({ error: 'Error al agregar al carrito' })
            return false
        }
        finally {
            set({ loading: false })
        }
    },

    removeFromCart: async (itemId) => {
        set({ loading: true, error: null })
        const state = get()
        const item = state.items.find(i => i.itemId === itemId)

        try {
            const res = await removeFromCartRequest(itemId)

            set({
                items: res.data.items,
                total: res.data.total,
            })

            trackEvent("REMOVE_FROM_CART", item.productId, {
                itemId
            })
        } catch (error) {
            console.error("Error removing from cart:", error)
            set({ error: 'Error al eliminar del carrito' })
        } finally {
            set({ loading: false })
        }
    },

    clearCart: async () => {

        clearCartRequest();

        set({ items: [], total: 0 });
    },

    updateItemQuantity: async (itemId, delta) => {
        const state = get()
        const item = state.items.find(i => i.itemId === itemId)
        
        if (!item) return

        const newQty = item.quantity + delta

        if (newQty <= 0) {
            return get().removeFromCart(itemId)
        }

        try {
            const res = await updateCartItemRequest(itemId, newQty)

            set({
                items: res.data.items,
                total: res.data.total,
                error: null
            })

        } catch (error) {
            console.error("Error updating cart item:", error)
            set({ error: 'Error al actualizar el carrito' })
        }

    },


    checkout: async () => {
        set({loading: true, error: null})

        try{
            const sessionId = useSessionStore.getState().getSessionId()
            const res = await checkoutRequest(sessionId)

            if (res?.data?.cart){
                set({
                    items: res.data.cart.items,
                    total: res.data.cart.total
                })
            } else {
                set({items:[], total:0})
            }

            return true

        } catch (err) {
            console.error("error al comprar: ",err)
            set({error: "Error al finalizar la compra"})
            return false
        } finally {
            set({loading: false})
        }
    }
}))
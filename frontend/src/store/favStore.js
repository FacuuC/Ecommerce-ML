import { create } from "zustand";
import { useAuthStore } from "./authStore";

export const useFavoritesStore = create((set, get) => ({
    //Estado
    favorites: [],

    //Acciones
    addFavorite: (celId) => {

        set((state) => ({
            favorites: state.favorites.includes(celId)
            ? state.favorites
            : [...state.favorites, celId]
        }))
    },

    removeFavorite: (celId) => {
        set((state) => ({
            favorites: state.favorites.filter((id) => id !== celId)
        }))
    },

    isFavorite: (celId) => {
        return get().favorites.includes(celId)
    },

    toggleFavorite: (celId) => {
        const isLoggedIn = useAuthStore.getState().isLoggedIn

        if (!isLoggedIn) {
            toast.error("Debes iniciar sesión para agregar favoritos")
            return
        }

        const { addFavorite, removeFavorite, isFavorite } = get ()
        const isFav = isFavorite(celId)

        isFav ? removeFavorite(celId) : addFavorite(celId)        
    },
    
    countFavorites: () => get().favorites.length
}))
import { createContext, use, useState } from "react";

export const FavoritesContext = createContext()

export function FavoriteProvider ({ children }) {
    const [ favorites, setFavorites ] = useState([])

    const addFavorite = (cel) => {
        setFavorites((prevFavorites) => [...prevFavorites, cel])
    }

    const removeFavorite = (celId) => {
        setFavorites((prevFavorites) => 
        prevFavorites.filter((cel) => cel.id) !== celId
        )
    }

    const isFavorite = (celId) => {
        return favorites.some((cel) => cel.id === celId)
    }

    const value = {
        favorites, 
        addFavorite,
        removeFavorite,
        isFavorite
    }

    return (
        <FavoritesContext value={value}>
            {children}
        </FavoritesContext>
    )
}

export function useFavorites() {
    const context = use(FavoritesContext)

    if (context === undefined){
        throw new Error('useFavorites must be used within a FavoritesProvider')
    }

    return context
}
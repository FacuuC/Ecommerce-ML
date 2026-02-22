import { useFavoritesStore } from "../store/favStore"
import { trackEvent } from "../services/trackingService"

export function CelFavButton({ cel, pageSource }) {
    const favs = useFavoritesStore((state) => state.favorites)
    const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)

    const isFav = favs.includes(cel.id)
    const eventType = isFav ? "REMOVE_FROM_FAVORITES" : "ADD_TO_FAVORITES"

    const handleToggleFav = () => {
        toggleFavorite(cel.id)

        trackEvent(
            eventType, 
            cel.id, 
            { 
                source: "favorite_button",
                page: pageSource})
    }

    return (
        <button
            className={`btn-fav ${isFav ? 'active' : ''}`}
            onClick={handleToggleFav}
            aria-label="Toggle favorite"
        >
            <img
                src="/fav.svg"
                aria-label="Agregar a favoritos"
                alt="heart"
                className="fav-svg" />
        </button>
    )
}
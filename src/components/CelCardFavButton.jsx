import { useFavoritesStore } from "../store/favStore"

export function CelCardFavButton({ cel }) {
    const favs = useFavoritesStore((state) => state.favorites)
    const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)

    const isFav = favs.includes(cel.id)

    return (
        <button
            className={`btn-fav ${isFav ? 'active' : ''}`}
            onClick={() => toggleFavorite(cel.id)}
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
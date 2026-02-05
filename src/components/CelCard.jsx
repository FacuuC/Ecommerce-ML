import { CelCardFavButton } from "./CelCardFavButton"
import { Link } from "./Link"
import { useAuthStore } from "../store/authStore"

export function CelCard({ productoCel }) {
    const { isLoggedIn } = useAuthStore()

    return (
        <article key={productoCel.id} className="producto-card">
            {isLoggedIn && (
                <CelCardFavButton cel={productoCel} />
            )
            }
            <h3>{productoCel.modelo}</h3>
            <div className="producto-info">
                <p><strong>Capacidad:</strong> {productoCel.almacenamiento} GB</p>
                <p><strong>Color:</strong> {productoCel.color}</p>
                <p><strong>Batería:</strong> {productoCel.bateria}%</p>
                <div className="detalle-precio">
                    <p className="precio"><strong>Precio:</strong> ${productoCel.precio}</p>
                    <Link to={`/celulares/${productoCel.id}`}>
                        <button className="btn-comprar">Saber más</button>
                    </Link>
                </div>
            </div>
            {productoCel.descripcion && (
                <p className="detalles">{productoCel.descripcion}</p>
            )}
        </article>
    )
}
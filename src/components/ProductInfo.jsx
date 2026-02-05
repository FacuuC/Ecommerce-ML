import styles from "../components/ProductInfo.module.css"
import { useState } from "react"
import { useAuthStore } from "../store/authStore"

export function ProductInfo({ cel }) {
    const [productQuantity, setProductQuantity] = useState(1)

    const increase = () => setProductQuantity(prev => prev + 1)
    const decrease = () => setProductQuantity(prev => Math.max(1, prev - 1))
    
    const { isLoggedIn } = useAuthStore()

    return (
        <section className={styles.productInfo}>
            <header className={styles.productHeader}>
                <div className={styles.productRating}>
                    <p className={styles.brand}>Apple</p>
                    <p className={styles.rating}>⭐ 4.9 (124 reviews)</p>
                </div>
                <h1>{cel.modelo}</h1>
                <p className={styles.description}>
                    Dynamic Island, una forma mágica de interactuar con tu iPhone. Camara de 48MP para un nivel de detalle asombroso. Y todo en un diseño resistente.
                </p>
            </header>
            <div className={styles.priceDetail}>
                <p className={styles.price}>
                    <strong>${cel.precio}</strong>
                </p>
                <span className={styles.stock}>
                    En Stock
                </span>
            </div>


            <form className={styles.productOptions}>

                <fieldset>
                    <legend>Color: {cel.color}</legend>
                    <div className={styles.colorOptions}>
                        <label>
                            <input type="radio" name="color" />
                            <span className={styles.colorCircle}></span>
                        </label>
                        <label>
                            <input type="radio" name="color" />
                            <span className={styles.colorCircle}></span>
                        </label>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Almacenamiento</legend>
                    <div className={styles.storageOptions}>
                        <label>
                            <input type="radio" name="storage" />
                            <span>128GB</span>
                        </label>
                        <label>
                            <input type="radio" name="storage" />
                            <span>256GB</span>
                        </label>
                        <label>
                            <input type="radio" name="storage" />
                            <span>512GB</span>
                        </label>
                    </div>
                </fieldset>
                <div className={styles.shippingActions}>
                    <div className={styles.quantity}>
                        <button type="button" onClick={decrease}>-</button>
                            <input 
                            type="number" 
                            value={productQuantity}
                            min="1" defaultValue="1" 
                            onChange={(e) => setProductQuantity(Number(e.target.value) || 1)}/>
                        <button type="button" onClick={increase}>+</button>

                        <div className={styles.shippingInfo}>
                            <p>Envío gratis</p>
                            <p>Llega mañana</p>
                        </div>
                    </div>
                    <div className={styles.shippingButtons}>
                        <button disabled={!isLoggedIn} type="submit" className={styles.btnAddToCart}>
                            {isLoggedIn ? '🛒 Añadir al carrito' : "Inicia Sesion para Añadir al carrito"}
                        </button>
                        <button type="button" className={styles.btnShare} aria-label="Compartir producto">
                            🔗
                        </button>
                    </div>

                </div>
            </form>

            <footer className={styles.extra}>
                <p>Garantía oficial de 12 meses incluida</p>
            </footer>
        </section>
    )
}
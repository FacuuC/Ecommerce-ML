import { useParams, useNavigate } from "react-router"
import { useState, useEffect, useRef } from "react"

import { Link } from "../components/Link"
import { ProductGallery } from "../components/ProductGallery"
import { ProductInfo } from "../components/ProductInfo"
import { trackEvent } from "../services/trackingService"

import styles from "../styles/Detail.module.css"

export default function CelDetail() {
    const { celId } = useParams()

    const [cel, setCel] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate() 
    const hasTracked = useRef(false)

    const images = [
        { src: "../public/frontal-posterior.webp", alt: "Vista general" },
        { src: "../public/frontal.webp", alt: "Vista frontal" },
        { src: "../public/posterior-lateral.webp", alt: "Vista posterior" }
    ]

    useEffect(() => {
        fetch(`http://localhost:8080/celulares/${celId}`)
            .then(res => {
                if (!res.ok) throw new Error('Cel not found')
                return res.json()
            })
            .then(json => {
                setCel(json)
            })
            .catch(err => {
                setError(err.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [celId])

    useEffect(() => {
        if (cel?.id && !hasTracked.current) {
            trackEvent("VIEW_PRODUCT", cel.id, {
                source: "detail_page"
            })
            hasTracked.current = true
        }
    }, [cel])

    if (loading) {
        return <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
            <div className={styles.loading}>
                <p className={styles.loadingText}>Cargando...</p>
            </div>
        </div>
    }

    if (error || !cel) {
        return <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
            <div className={styles.error}>
                <h2 className={styles.errorTitle}>
                    Producto no encontrado!
                </h2>
                <button
                    onClick={() => navigate('/')}
                    className={styles.errorButton}
                >
                    Volver al inicio
                </button>
            </div>
        </div>
    }
    return (
        <div className={styles.container}>
            <main className={styles.celDetail}>

                <nav className={styles.breadcrumb}>
                    <div className={styles.breadcrumbContent}>
                        <Link
                            to="/"
                            className={styles.breadcrumbButton}>
                            Inicio
                        </Link>
                        <span
                            className={styles.breadcrumbSpan}
                        >{'>'}</span>
                        <Link
                            className={styles.breadcrumbButton}
                            to="/search">
                            Celulares
                        </Link>
                        <span
                            className={styles.breadcrumbSpan}
                        >{'>'}</span>
                        <span
                            className={styles.breadcrumbModel}
                        >{cel.modelo}</span>
                    </div>
                </nav>

                <article className={styles.productArticle}>

                    {/* Product Section */}
                    <ProductGallery images={images} cel={cel}/>

                    {/* Información */}
                    <ProductInfo cel={cel} />
                </article>
                <section className={styles.relatedProducts}>
                    <header className={styles.relatedProductsHeader}>
                        <h2>También te puede interesar</h2>
                        <div className={styles.navigationArrows}>
                            <button aria-label="Anterior">←</button>
                            <button aria-label="Siguiente">→</button>
                        </div>
                    </header>

                    <div className={styles.productGrid}>
                        <article className={styles.relatedProductCard}>
                            <Link>
                                <figure className={styles.relatedImage}>
                                    <img src="../public/frontal-posterior.webp" alt="Vista general"></img>
                                </figure>
                                <span className={styles.badge}>Apple</span>
                                <h3 className={styles.celModel}>iPhone 13 - Midnight</h3>
                                <p className={styles.price}>$699</p>
                            </Link>
                        </article>


                        <article className={styles.relatedProductCard}>
                            <Link>
                                <figure className={styles.relatedImage}>
                                    <img src="../public/frontal-posterior.webp" alt="Vista general"></img>
                                </figure>
                                <span className={styles.badge}>Apple</span>
                                <h3 className={styles.celModel}>iPhone 14 - Blue</h3>
                                <p className={styles.price}>$799</p>
                            </Link>
                        </article>


                        <article className={styles.relatedProductCard}>
                            <Link>
                                <span className={styles.badgeDiscount}>-10%</span>
                                <figure className={styles.relatedImage}>
                                    <img src="../public/frontal-posterior.webp" alt="Vista general"></img>
                                </figure>
                                <span className={styles.badge}>Apple</span>
                                <h3 className={styles.celModel}>Silicone Case MagSafe</h3>
                                <p className={styles.price}>$45</p>
                            </Link>
                        </article>

                        <article className={styles.relatedProductCard}>
                            <Link>

                                <figure className={styles.relatedImage}>
                                    <img src="../public/frontal-posterior.webp" alt="Vista general"></img>
                                </figure>
                                <span className={styles.badge}>Apple</span>
                                <h3 className={styles.celModel}>iPhone 13 Mini</h3>
                                <p className={styles.price}>$699</p>
                            </Link>
                        </article>
                    </div>
                </section>
            </main>
        </div>
    )
}
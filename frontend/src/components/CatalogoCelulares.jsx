import { CelCard } from "./CelCard"

export function CatalogoCelulares({ celulares }) {
    return (
            <section id="catalogo-section">
                <h2>Catálogo de Celulares</h2>
                <div id="catalogo-grid">
                    {celulares.length === 0 
                        ? <p style={{textAlign: 'center', padding:'0.5rem'}}>No se han encontrado celulares con los criterios de busqueda seleccionados</p> 
                        :celulares.map((producto) => (
                            <CelCard key={producto.id} productoCel={producto}/>
                    ))}
                    
                </div>
            </section>
    )
}



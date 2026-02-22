import { useEffect } from "react"
import { useFilters } from "../hooks/useFilters.jsx"

import { CatalogoCelulares } from "../components/CatalogoCelulares.jsx"
import { Pagination } from "../components/Pagination.jsx"

import '../App.css'
import { SearchFormSection } from "../components/SearchFormSection.jsx"

export default function SearchPage() {
    const {
        handleFiltersChange,
        handlePageChange,
        filters,
        cels,
        loading,
        currentPage,
        totalPages,
        totalResultados
    } = useFilters()

    useEffect (() => {
        document.title = `Resultados: ${totalResultados}, Página ${currentPage} - MatienzoShop`
    }, [totalResultados, currentPage])

    return (
        <main>
            <SearchFormSection 
            initialFilters={filters} 
            onFiltersChange={handleFiltersChange} 
            />
            
            <section>{
                loading ? <p>Cargando empleos...</p> : <CatalogoCelulares celulares={cels} />
            }
                {totalPages > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </section>
        </main>
    )
}
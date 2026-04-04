import { useState } from "react"

import { CatalogoCelulares } from "./components/CatalogoCelulares.jsx"
import { Footer } from "./components/Footer.jsx"
import { Header } from "./components/Header.jsx"
import { Pagination } from "./components/Pagination.jsx"

import iphonesData from "./productosIphone.json"

import './App.css'
import { SearchFormSection } from "./components/SearchFormSection.jsx"

const RESULTS_PER_PAGE = 12

export function Catalogo() {
    const [filters, setFilters] = useState({
        search: '',
        marca:'',
        capacidad:'',
        bateria:''
    })

    const [currentPage, setCurrentPage] = useState(1)

    const celsFilteredByFilters = iphonesData.filter(cel => {
        const modelo = cel.MODELO ? cel.MODELO.toLowerCase() : ''
        const capacidad = cel.CAPACIDAD ? String(cel.CAPACIDAD) : ''
        const bateria = cel.BATERÍA ? parseInt(cel.BATERÍA) : 0

        const searchFilter = filters.search ? filters.search.toLowerCase() : ''
        const matchText = !searchFilter || modelo.includes(searchFilter)

        const marcaFilter = filters.marca ? filters.marca.toLowerCase() : ''
        const matchMarca = !marcaFilter || modelo.includes(marcaFilter)

        const capacidadFilter = filters.capacidad
        const matchCap = !capacidadFilter || capacidad === capacidadFilter

        const bateriaFilter = filters.bateria ? parseInt(filters.bateria) : 0
        let matchBat = true
        if (bateriaFilter) {
            const val = parseInt(bateriaFilter)

            if (val === 100) {
                matchBat = bateria === 100
            } else if (val === 84) {
                matchBat = bateria <= 84
            } else {
                matchBat = bateria >= val && bateria < (val + 5)
            }
        }
        
        return(
            matchText &&
            matchMarca &&
            matchCap &&
            matchBat
        )
    })

    const totalPages = Math.ceil(celsFilteredByFilters.length / RESULTS_PER_PAGE)

    const pagedResults = celsFilteredByFilters.slice(
        (currentPage - 1) * RESULTS_PER_PAGE,
        currentPage * RESULTS_PER_PAGE
    )

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleFiltersChange = (newFilters) => {
        console.log(newFilters)
        setFilters(newFilters)
        setCurrentPage(1)
    }

    return (
        <>
            <Header />
            <SearchFormSection 
                onFiltersChange={handleFiltersChange} 
            />
            <div id="main-catalogo">
                <CatalogoCelulares iphones={pagedResults} />
            </div>
            {celsFilteredByFilters.length > 0 && (
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={handlePageChange} 
                />
            )}
            <Footer />
        </>
    )
}
import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "react-router"
import { trackEvent } from "../services/trackingService"


const RESULTS_PER_PAGE = 12

export function useFilters() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [filters, setFilters] = useState(() => {
        // Leer batería: puede venir como minBateria o maxBateria
        const minBateria = searchParams.get('minBateria')
        const maxBateria = searchParams.get('maxBateria')
        const bateria = minBateria || maxBateria || ''

        return {
            search: searchParams.get('search') || '',
            marca: searchParams.get('marca') || '',
            capacidad: searchParams.get('almacenamiento') || '',
            bateria: Number(bateria)
        }
    })

    const [currentPage, setCurrentPage] = useState(() => {
        const page = Number(searchParams.get('page'))
        if (Number.isNaN(page) || Number(page) <= 0) {
            return 1
        }
        console.log(Number(page))
        return Number(page)
    })

    const [cels, setCels] = useState([])
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1)
    const [totalResultados, setTotalResultados] = useState(1)
    const lastQueryRef = useRef("")

    const pageBackend = currentPage - 1

    useEffect(() => {
        async function fetchCels() {
            try {
                const params = new URLSearchParams()
                if (filters.search) params.append('search', filters.search)
                if (filters.marca) params.append('marca', filters.marca)
                if (filters.capacidad) params.append('almacenamiento', filters.capacidad)
                if (filters.bateria) {
                    if (filters.bateria <= 84) { params.append('maxBateria', filters.bateria) }
                    else {
                        params.append('minBateria', filters.bateria)
                        if (filters.bateria === 100) { params.append('maxBateria', filters.bateria) }
                        else { params.append('maxBateria', (filters.bateria + 4)) }
                    }
                }
                params.append('size', RESULTS_PER_PAGE)
                params.append('page', pageBackend)

                const queryParams = params.toString()

                setLoading(true)
                const url = `http://localhost:8080/celulares?${queryParams}`
                const response = await fetch(url)
                const data = await response.json()

                if (data.content) {
                    setCels(data.content)
                    setTotalPages(data.totalPages)
                    setTotalResultados(data.totalElements)

                    const cleanQuery = filters.search?.trim()

                    if (cleanQuery && lastQueryRef.current !== cleanQuery) {
                        trackEvent("SEARCH_QUERY", 
                            null, 
                            {
                                query: cleanQuery,
                                resultsCount: data.totalElements,
                                filters: {
                                    marca: filters.marca || null,
                                    capacidad: filters.capacidad || null,
                                    bateria: filters.bateria || null
                                },
                                source:"search_page"
                            }
                        )
                        lastQueryRef.current = cleanQuery
                    }
                } else {
                    setCels([])
                }
            } catch (error) {
                console.error('Error fetching celulares: ', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCels()
    }, [filters, currentPage])

    useEffect(() => {
            const params = new URLSearchParams()

            if (filters.search) params.set('search', filters.search)
            if (filters.marca) params.set('marca', filters.marca)
            if (filters.capacidad) params.set('almacenamiento', filters.capacidad)
            
            if (filters.bateria) {
                if (filters.bateria <= 84) { 
                    params.set('maxBateria', filters.bateria) 
                } else {
                    params.set('minBateria', filters.bateria)
                    params.set('maxBateria', filters.bateria === 100 ? 100 : filters.bateria + 4)
                }
            }

            if (currentPage > 1) params.set('page', currentPage)
            setSearchParams(params)

    }, [filters, currentPage])

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters)
        setCurrentPage(1)
    }

    return {
        handlePageChange,
        handleFiltersChange,
        filters,
        cels,
        loading,
        currentPage,
        totalPages,
        totalResultados
    }
}
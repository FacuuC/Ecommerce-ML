import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import { useSearchParams } from "react-router"
import { trackEvent } from "../services/trackingService"

const RESULTS_PER_PAGE = 12
const DEBOUNCE_DELAY = 400 // ms de espera antes de hacer la búsqueda

export function useFilters() {
    const [searchParams, setSearchParams] = useSearchParams()
    const searchParamsString = searchParams.toString() // Convertir a string para usar como dependencia en useEffect

    const [filters, setFilters] = useState(() => {
        // Leer batería: puede venir como minBateria o maxBateria
        const minBateria = searchParams.get('minBateria')
        const maxBateria = searchParams.get('maxBateria')
        const bateria = minBateria || maxBateria || ''

        return {
            search: searchParams.get('search') || '',
            marca: searchParams.get('marca') || '',
            capacidad: searchParams.get('almacenamiento') || '',
            bateria: bateria 
        }
    })

    const [currentPage, setCurrentPage] = useState(() => {
        const page = Number(searchParams.get('page'))
        if (Number.isNaN(page) || Number(page) <= 0) {
            return 1
        }
        return Number(page)
    })

    const [cels, setCels] = useState([])
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1)
    const [totalResultados, setTotalResultados] = useState(1)
    
    // Flag para indicar si la búsqueda fue iniciada por el usuario (no por carga inicial)
    const isUserInitiatedRef = useRef(false)
    const lastQueryRef = useRef("")
    
    // Refs para debouncing
    const debounceTimerRef = useRef(null)
    const pendingFiltersRef = useRef(null)

    const pageBackend = useMemo(() => currentPage - 1, [currentPage]) // Backend es 0-indexed

    const buildQueryParams = useCallback((filters, page) => {
        const params = new URLSearchParams()

        if (filters.search) params.append('search', filters.search)
        if (filters.marca) params.append('marca', filters.marca)
        if (filters.capacidad) params.append('almacenamiento', filters.capacidad)

        if (filters.bateria) {
            const b = Number(filters.bateria)
            if (b <= 84) { params.append('maxBateria', b) }
            else {
                params.append('minBateria', b)
                params.append('maxBateria', b === 100 ? 100 : b + 4)
            }
        }

        params.append('size', RESULTS_PER_PAGE)
        params.append('page', page)

        return params
    }, [])

    useEffect(() => {
        // Limpiar timer anterior de debounce
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current)
        }

        // Guardar los filtros actuales para usar en el timeout
        pendingFiltersRef.current = { filters, currentPage, pageBackend }

        // Establecer nuevo timer de debounce
        debounceTimerRef.current = setTimeout(() => {
            const controller = new AbortController()
            const { filters: pendingFilters, currentPage: pendingPage, pageBackend: pendingPageBackend } = pendingFiltersRef.current

            async function fetchCels() {
                try {
                    const params = buildQueryParams(pendingFilters, pendingPage)
                    params.set('page', pendingPageBackend) // El backend es 0-indexed

                    if (!controller.signal.aborted) setLoading(true)
                    const queryParams = params.toString()

                    const url = new URL('http://localhost:8080/celulares')
                    url.search = queryParams

                    const res = await fetch(url, { signal: controller.signal })
                    const data = await res.json()

                    if (data.content) {
                        setCels(data.content)
                        setTotalPages(data.totalPages)
                        setTotalResultados(data.totalElements)

                        // Solo trackear si la búsqueda fue iniciada por el usuario
                        if (isUserInitiatedRef.current) {
                            const queryKey = `${pendingFilters.search}|${pendingFilters.marca}|${pendingFilters.capacidad}|${pendingFilters.bateria}`

                            if (queryKey !== lastQueryRef.current) {
                                trackEvent("SEARCH_QUERY", 
                                    null, 
                                    {
                                        query: queryKey,
                                        resultsCount: data.totalElements,
                                        filters: {
                                            marca: pendingFilters.marca || null,
                                            capacidad: pendingFilters.capacidad || null,
                                            bateria: pendingFilters.bateria || null
                                        },
                                        source:"search_page"
                                    }
                                )
                                lastQueryRef.current = queryKey
                            }
                        }
                    } else {
                        setCels([])
                    }
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        console.error('Error fetching celulares: ', err)
                    }
                } finally {
                    if (!controller.signal.aborted) {
                        setLoading(false)
                    }
                }
            }

            fetchCels()

            return () => controller.abort()
        }, DEBOUNCE_DELAY)

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current)
            }
        }

    }, [filters, currentPage, buildQueryParams, pageBackend])



    useEffect(() => {
            const params = buildQueryParams(filters, currentPage)
            const newQuery = params.toString()

            if (newQuery !== searchParamsString) {
                setSearchParams(params, { replace: true })
            }

    }, [filters, currentPage, buildQueryParams, searchParamsString])

    useEffect(() => {
        const page = Number(searchParams.get('page')) || 1

        setCurrentPage(prev => prev === page ? prev : page)

        const newFilters = {
            search: searchParams.get('search') || '',
            marca: searchParams.get('marca') || '',
            capacidad: searchParams.get('almacenamiento') || '',
            bateria: searchParams.get('minBateria') || searchParams.get('maxBateria') || ''
        }

        setFilters(prev => {
            const isSame = 
                prev.search === newFilters.search &&
                prev.marca === newFilters.marca &&
                prev.capacidad === newFilters.capacidad &&
                prev.bateria === newFilters.bateria

            return isSame ? prev : newFilters
        })

    }, [searchParamsString])


    const handlePageChange = useCallback((page) => {
        const safePage = Math.max(1, page)
        setCurrentPage(prev => prev === safePage ? prev : safePage)
    }, [])

    const handleFiltersChange = useCallback((newFilters) => {
        // Marcar que el usuario inició la búsqueda para trackear el evento
        isUserInitiatedRef.current = true
        
        setFilters(prev => {
            const isSame = 
                prev.search === newFilters.search &&
                prev.marca === newFilters.marca &&
                prev.capacidad === newFilters.capacidad &&
                prev.bateria === newFilters.bateria

            if (isSame) return prev
            return newFilters
        })

        setCurrentPage(1)
    }, [])

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
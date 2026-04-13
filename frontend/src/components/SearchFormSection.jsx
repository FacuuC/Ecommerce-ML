import { useId, useRef, useEffect } from "react"
import { useSearchForm } from "../hooks/useSearchForm"
import { useState } from "react"

export function SearchFormSection({ onFiltersChange, initialFilters }) {
    const idText = useId()
    const idMarca = useId()
    const idCapacidad = useId()
    const idBateria = useId()
    const inputRef = useRef()
    const selectMarcaRef = useRef()
    const selectCapacidadRef = useRef()
    const selectBateriaRef = useRef()

    const { handleFormChange, handleClearInput } = useSearchForm({idText, idMarca, idCapacidad, idBateria, onFiltersChange, inputRef})
    const [ marcas, setMarcas] = useState([])
    const [ selectedMarca, setSelectedMarca ] = useState(initialFilters?.marca || '')

    useEffect(() => {
        fetch('http://localhost:8080/celulares/marcas')
            .then(response => response.json())
            .then(data => {
                console.log('Marcas fetched:', data)
                setMarcas(data)
            })
            .catch(error => console.error('Error fetching marcas:', error))
    }, [])

    // Actualizar valores cuando cambien los initialFilters (desde la URL)
    useEffect(() => {
        if (inputRef.current && initialFilters?.search !== undefined) {
            inputRef.current.value = initialFilters.search || ''
        }
        if (selectMarcaRef.current && initialFilters?.marca !== undefined) {
            selectMarcaRef.current.value = initialFilters.marca || ''
        }
        if (selectCapacidadRef.current && initialFilters?.capacidad !== undefined) {
            // Convertir a string si es número
            const capacidadValue = initialFilters.capacidad ? String(initialFilters.capacidad) : ''
            selectCapacidadRef.current.value = capacidadValue
        }
        if (selectBateriaRef.current && initialFilters?.bateria !== undefined) {
            // Convertir a string si es número
            const bateriaValue = initialFilters.bateria ? String(initialFilters.bateria) : ''
            selectBateriaRef.current.value = bateriaValue
        }
        setSelectedMarca(initialFilters?.marca || '')
    }, [initialFilters])
        return (
        <section className="cels-search">
            <h1>Encuentra tu próximo iPhone</h1>
            <p>Explora entre gran variedad de oportunidades</p>

            <form onChange={handleFormChange} role="search" id="cels-search-form">

                <div className="search-bar">
                    <input
                        ref={inputRef}
                        name={idText} type="text" id="cels-search-input"
                        placeholder="Busca celulares"
                        defaultValue={initialFilters?.search || ''}
                    />

                    <button onClick={handleClearInput}>Limpiar filtros</button>
                </div>
                <div className="search-filters">
                    <select 
                    ref={selectMarcaRef}
                    value={selectedMarca}
                    name={idMarca}
                    >
                        <option value="">Marca</option>
                        {marcas.map(marca => (
                            <option key={marca} value={marca}>{marca}</option>
                        ))}
                    </select>
                    <select 
                    ref={selectCapacidadRef}
                    defaultValue={initialFilters?.capacidad ? String(initialFilters.capacidad) : ''}
                    name={idCapacidad} 
                    id="capacity-filter"
                    >
                        <option value="">Capacidad</option>
                        <option value="64">64 GB</option>
                        <option value="128">128 GB</option>
                        <option value="256">256 GB</option>
                        <option value="512">512 GB</option>
                    </select>
                    <select 
                    ref={selectBateriaRef}
                    defaultValue={initialFilters?.bateria ? String(initialFilters.bateria) : ''}
                    name={idBateria} 
                    id="batery-filter"
                    >
                        <option value="">Bateria</option>
                        <option value="100">100% (Nuevo)</option>
                        <option value="95">95% - 99%</option>
                        <option value="90">90% - 94%</option>
                        <option value="85">85% - 89%</option>
                        <option value="84">Menos de 84%</option>
                    </select>

                </div>
            </form>
        </section>
    )
}
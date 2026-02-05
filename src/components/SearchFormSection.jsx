import { useId, useRef, useEffect } from "react"
import { useSearchForm } from "../hooks/useSearchForm"

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
                    defaultValue={initialFilters?.marca || ''}
                    name={idMarca}
                    >
                        <option value="">Marca</option>
                        <option value="Apple">Apple</option>
                        <option value="Samsung">Samsung</option>
                        <option value="Xiaomi">Xiaomi</option>
                        <option value="Motorola">Motorola</option>
                        <option value="Huawei">Huawei</option>
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
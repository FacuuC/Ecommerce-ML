import { useId, useEffect, useRef } from "react"
import { useSearchForm } from "../hooks/useSearchForm"
import { useState } from "react"

export function SearchFormSection({ onFiltersChange, initialFilters }) {
    const [ marcas, setMarcas] = useState([])

    useEffect(() => {
        fetch('http://localhost:8080/celulares/marcas')
            .then(res => res.json())
            .then(setMarcas)
            .catch(error => console.error('Error fetching marcas:', error))
    }, [])

    const handleChange = (field, value) => {
        onFiltersChange({
            ...initialFilters,
            [field]: value
        })
    }

    const handleClear = () => {
        onFiltersChange({
            search: '',
            marca: '',
            capacidad: '',
            bateria: ''
        })
    }

    return (
        <section className="cels-search">
            <h1>Encuentra tu próximo iPhone</h1>
            <p>Explora entre gran variedad de oportunidades</p>

            
                <div className="search-bar">
                    <input
                        value={initialFilters.search || ''}
                        placeholder="Busca celulares"
                        onChange={(e) => handleChange('search', e.target.value)}
                    />

                    <button onClick={handleClear}>
                        Limpiar filtros
                    </button>

                </div>

                <div className="search-filters">
                    <select 
                    value={initialFilters.marca || ''}
                    onChange={(e) => handleChange('marca', e.target.value)}
                    >
                        <option value="">Marca</option>
                        {marcas.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>

                    <select 
                    value={initialFilters.capacidad || ''}
                    onChange={(e) => handleChange('capacidad', e.target.value)}
                    >
                        <option value="">Capacidad</option>
                        <option value="64">64 GB</option>
                        <option value="128">128 GB</option>
                        <option value="256">256 GB</option>
                        <option value="512">512 GB</option>
                    </select>

                    <select 
                    value={initialFilters.bateria || ''}
                    onChange={(e) => handleChange('bateria', e.target.value)}
                    >
                        <option value="">Bateria</option>
                        <option value="100">100% (Nuevo)</option>
                        <option value="95">95% - 99%</option>
                        <option value="90">90% - 94%</option>
                        <option value="85">85% - 89%</option>
                        <option value="84">Menos de 84%</option>
                    </select>

                </div>
        </section>
    )
}
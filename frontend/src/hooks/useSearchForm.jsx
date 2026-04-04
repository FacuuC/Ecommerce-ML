import { useState, useRef} from "react"

export function useSearchForm ({idText, idMarca, idCapacidad, idBateria, inputRef, onFiltersChange}) {
    const [searchText, setSearchText] = useState("")

    const timeoutId = useRef(null)
    
    const handleFormChange = (event) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const text = formData.get(idText)
        setSearchText(text)

        const filters = {
            search: text,
            marca: formData.get(idMarca),
            capacidad: formData.get(idCapacidad) === "" ? formData.get(idCapacidad) : parseInt(formData.get(idCapacidad)),
            bateria: formData.get(idBateria) === "" ? formData.get(idBateria) : parseInt(formData.get(idBateria))
        }

        //Debounce
        if (timeoutId.current){
            clearTimeout(timeoutId.current)
        }
        timeoutId.current = setTimeout(() => {
            onFiltersChange(filters)
        }, 500)
        
    }

    const handleClearInput = (event) => {
        event.preventDefault()
        inputRef.current.value = ""
        onFiltersChange({
            search: '',
            marca: '',
            capacidad: '',
            bateria: ''
        })

    }

    return {
        searchText,
        handleFormChange,
        handleClearInput
        } 
}

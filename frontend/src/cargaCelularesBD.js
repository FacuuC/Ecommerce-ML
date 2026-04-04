import { resumeToPipeableStream } from "react-dom/server"
import iphoneData from "./productosIphone.json"

export function mostrarListaNormalizada() {
    const listaLimpia = iphoneData.map(item => {
        return {
            marca: "Apple",
            modelo: item.MODELO || item.Modelo || item.modelo,
            almacenamiento: parseInt(item.CAPACIDAD),
            bateria: parseInt(item.BATERIA),
            precio: parseFloat(item.PRECIO),
            descripcion: item.DETALLES === "" ? null : item.DETALLES,
            color: item.COLOR,
            stock: item.STOCK ? parseInt(item.STOCK) : 1
        }
    })

    console.log(listaLimpia[0])
    console.log("🛑 ¿QUÉ ESTOY ENVIANDO?:", JSON.stringify(listaLimpia[0]));

    const url = 'http://localhost:8080/celulares/cargaMasiva'

    /* fetch (url, {
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(listaLimpia)
    })
    .then(async response =>{
        if(!response.ok){
            const errorData = await response.json()
            throw new Error(JSON.stringify(errorData))
        } else {
            return response.json()
        }
    })
    .then(data => {
        console.log('Éxito:', data)
    })
    .catch(error => {
        console.error('Errores de validacion:', error.message)
    }) */
    
}
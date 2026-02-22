import axios from 'axios'

const eventClient = axios.create({
    baseURL: 'http://localhost:8080'
})

eventClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization= `Bearer ${token}`
    }
    return config
})

export const trackEventRequest = async (eventData) => {
    return eventClient.post("/events", eventData)
}
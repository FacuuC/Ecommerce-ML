import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080'
})

export const loginRequest = (data) => 
    api.post('/auth/login', data)


export const registerRequest = (data) => 
    api.post('/auth/register', data)

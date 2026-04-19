import { publicApi } from "./publicApi"
import { privateApi } from "./privateApi"

export const loginRequest = (data) => 
    publicApi.post('/auth/login', data)


export const registerRequest = (data) => 
    publicApi.post('/auth/register', data)

export const verifyTokenRequest = () => 
    privateApi.get("/auth/me")

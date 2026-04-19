import { privateApi } from "./privateApi.js"

export const trackEventRequest = async (eventData) => {
    return privateApi.post("/events", eventData)
}
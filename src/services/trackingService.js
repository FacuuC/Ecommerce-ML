import { getAnonymousId } from "../utils/anonymousId";
import { trackEventRequest } from "../api/eventApi";
import { useAuthStore } from "../store/authStore";
import { useSessionStore } from "../store/sessionStore";

export const trackEvent = async (eventType, productId, metadata = {}) => {
    try {
        const { user } = useAuthStore.getState()
        const sessionId = useSessionStore.getState().getSessionId()
        console.log("SESSION_ID = ", sessionId)

        const eventPayload = {
            eventType,
            productId,
            sessionId,
            metadata,
            ...(user ? {} : {anonymousId: getAnonymousId()})
        }        

        await trackEventRequest(eventPayload)

    } catch (error) {
        console.error('Error tracking event:', error)
    }
}
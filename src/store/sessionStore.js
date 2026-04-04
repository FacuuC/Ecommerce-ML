import { create } from "zustand"

export const useSessionStore = create((set, get) => ({
    sessionId: null,

    initSession: () => {
        let sessionId = sessionStorage.getItem("sessionId")

        if (sessionId) {
            set({ sessionId })
            return sessionId
        } else {
            const newSessionId = crypto.randomUUID()
            sessionStorage.setItem("sessionId", newSessionId)
            set({ sessionId: newSessionId })  
            return newSessionId                
        }
    },
    getSessionId: () => {
        const { sessionId, initSession } = get()
        return sessionId || initSession()
    },

    resetSession: () => {
        const newSessionId = crypto.randomUUID()
        sessionStorage.setItem("sessionId", newSessionId)
        set({ sessionId: newSessionId })
        return newSessionId
    }
})
)
export const getAnonymousId = () => {
    let anonymousId = localStorage.getItem('anonymousId')

    if (!anonymousId) {
        anonymousId = crypto.randomUUID()
        localStorage.setItem('anonymousId', anonymousId)
    }
    
    return anonymousId
}
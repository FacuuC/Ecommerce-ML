export function PromsSection({ children }) {
    return (
        <section id="proms-menu">
            <h3>Algunas promociones destacadas</h3>
            <div id="interesting-proms">
                {children}
            </div>
        </section>
    )
}
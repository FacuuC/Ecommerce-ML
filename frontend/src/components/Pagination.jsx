import styles from "../styles/Pagination.module.css"

export function Pagination({ currentPage = 1, totalPages = 5, onPageChange }) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

    const isFirstPage = currentPage <= 1
    const isLastPage = currentPage >= totalPages

    const stylePrevButton = isFirstPage ? styles.isDisabled : ''
    const styleNextButton = isLastPage ? styles.isDisabled : ''

    const handlePrevClick = (event) => {
        event.preventDefault()
        if (!isFirstPage) {
            onPageChange(currentPage - 1)
        }
    }

    const handleNextClick = (event) => {
        event.preventDefault()
        if (!isLastPage) {
            onPageChange(currentPage + 1)
        }
    }

    const handleChangePage = (event,page) => {
        event.preventDefault()
        if (page !== currentPage) {
            onPageChange(page)
        }
    }
    
    const buildPageUrl = (page) => {
        const url = new URL(window.location)
        url.searchParams.set('page', page)
        return `${url.pathname}?${url.searchParams.toString()}`
    }

    return (
        <nav className={styles.pagination}>
            <a href={buildPageUrl(Math.max(1, currentPage - 1))} className={stylePrevButton} onClick={handlePrevClick}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M15 6l-6 6l6 6" />
                </svg>
            </a>

            {pages.map(page =>
                <a
                    key={page}
                    href= {buildPageUrl(page)}
                    className={currentPage === page ? styles.isActive : ''}
                    onClick={(event) => handleChangePage(event,page)}
                >
                    {page}
                </a>
            )}
            <a href={buildPageUrl(Math.min(totalPages, currentPage + 1))} className={styleNextButton} onClick={handleNextClick}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M9 6l6 6l-6 6" />
                </svg>
            </a>
        </nav>
    )
}
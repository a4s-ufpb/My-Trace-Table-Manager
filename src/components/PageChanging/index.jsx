import styles from "./styles.module.css";
export default function PageChanging({ currentPage, totalPages, changePage }) {
    const getPageNumbers = () => {
        let pages = [];
        for (let i = 0; i < totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };
    return (
        <div className={styles.pagination} data-testid="pagination">
            <button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 0}
                data-testid="prev-page-button"
            >
                &laquo; Anterior
            </button>
            {getPageNumbers().map((pageNumber) => (
                <button
                    key={pageNumber}
                    onClick={() => changePage(pageNumber)}
                    className={currentPage === pageNumber ? `${styles.active}` : ""}
                    data-testid={`page-button-${pageNumber}`}
                >
                    {pageNumber + 1}
                </button>
            ))}
            <button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                data-testid="next-page-button"
            >
                Próximo &raquo;
            </button>
        </div>
    )
}
import { useState, useRef, useEffect } from "react";
import styles from "./styles.module.css";

export default function MultiSelect({ items, title, typeItem, selectedItems, setSelectedItems }) {
    const [search, setSearch] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setDropdownOpen(false);
                setSearch("");
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) &&
        !selectedItems.some(selected => selected.id === item.id)
    );

    const addItem = (item) => {
        setSelectedItems(prev => [...prev, item]);
        setSearch("");
        setDropdownOpen(false);
    };

    const removeItem = (itemId) => {
        setSelectedItems(prev => prev.filter(item => item.id !== itemId));
    };

    const hasItems = items.length > 0;

    if (!hasItems) {
        return (
            <>
                <label>{title}</label>
                <span>Não há {typeItem}! Cadastre para poder visualizar...</span>
            </>
        )
    }

    return (
        <div className={styles.container} ref={containerRef}>
            <label>{title}</label>
            <div className={styles.inputWrapper}>
                <input
                    type="text"
                    placeholder="Digite para buscar..."
                    value={search}
                    className={styles.searchInput}
                    onChange={e => {
                        setSearch(e.target.value);
                        if (!dropdownOpen) setDropdownOpen(true);
                    }}
                    onFocus={() => setDropdownOpen(true)}
                />
                <button
                    type="button"
                    className={styles.toggleButton}
                    onClick={() => setDropdownOpen(prev => !prev)}
                    aria-label="Toggle dropdown"
                >
                    {"\u25BC"}
                </button>
            </div>

            {dropdownOpen && (
                <div className={styles.dropdown}>
                    {(search === "" ? 
                        items.filter(item => !selectedItems.some(selected => selected.id === item.id)) : 
                        filteredItems
                    ).length > 0 ? (
                        (search === "" ? 
                            items.filter(item => !selectedItems.some(selected => selected.id === item.id)) : 
                            filteredItems
                        ).map(item => (
                            <div
                                key={item.id}
                                className={styles.dropdownItem}
                                onClick={() => addItem(item)}
                            >
                                {item.name}
                            </div>
                        ))
                    ) : (
                        <div className={styles.noResults}>Nenhum item encontrado</div>
                    )}
                </div>
            )}

            <div className={styles.selectedContainer}>
                {selectedItems.map(item => (
                    <div key={item.id} className={styles.selectedTag}>
                        {item.name}
                        <button
                            onClick={() => removeItem(item.id)}
                            className={styles.removeButton}
                        >
                            x
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

import { useState, useRef, useEffect } from "react";
import styles from "./styles.module.css";
import { BiSolidChevronDown } from "react-icons/bi";

export default function MultiSelect({ items, title, typeItem, selectedItems, setSelectedItems }) {
    const [search, setSearch] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const itemsRefs = useRef([]);
    itemsRefs.current = [];

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

    useEffect(() => {
        setHighlightedIndex(0);
    }, [search, dropdownOpen]);

    useEffect(() => {
        if (highlightedIndex < 0) return;
        const el = itemsRefs.current[highlightedIndex];
        if (el) {
            el.scrollIntoView({ block: "nearest" });
        }
    }, [highlightedIndex]);


    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) &&
        !selectedItems.some(selected => selected.id === item.id)
    );

    const addItem = (item) => {
        setSelectedItems(prev => [...prev, item]);
        setSearch("");
        setDropdownOpen(false);
        if (inputRef.current) {
            inputRef.current.blur();
        }
    };

    const removeItem = (itemId) => {
        setSelectedItems(prev => prev.filter(item => item.id !== itemId));
    };

    function handleKeyDown(e) {
        if (!dropdownOpen) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex(i => (i + 1) % filteredItems.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex(i => (i - 1 + filteredItems.length) % filteredItems.length);
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (highlightedIndex >= 0 && highlightedIndex < filteredItems.length) {
                addItem(filteredItems[highlightedIndex]);
            }
        } else if (e.key === "Escape") {
            setDropdownOpen(false);
        }
    }


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
        <div className={styles.container} ref={containerRef} data-testid="multi-select">
            <label>{title}</label>
            <div className={styles.inputWrapper}>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Digite para buscar..."
                    value={search}
                    className={styles.searchInput}
                    onKeyDown={handleKeyDown}
                    onChange={e => {
                        setSearch(e.target.value);
                        if (!dropdownOpen) setDropdownOpen(true);
                    }}
                    onFocus={() => setDropdownOpen(true)}
                    data-testid="multi-select-input"
                />
                <button
                    type="button"
                    className={styles.toggleButton}
                    onClick={() => setDropdownOpen(prev => !prev)}
                    aria-label="Toggle dropdown"
                >
                    <BiSolidChevronDown />
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
                        ).map((item, index) => (
                            <div
                                key={item.id}
                                ref={el => itemsRefs.current[index] = el}
                                className={`${styles.dropdownItem} ${index === highlightedIndex ? styles.highlighted : ""}`}
                                onClick={() => addItem(item)}
                                onMouseEnter={() => setHighlightedIndex(index)}
                                data-testid={`multi-select-item-${item.id}`}
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
                    <div key={item.id} className={styles.selectedTag} data-testid={`multi-select-selected-${item.id}`}>
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

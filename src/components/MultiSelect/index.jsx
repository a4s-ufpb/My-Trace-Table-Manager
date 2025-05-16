import { useState } from "react";
import styles from "./styles.module.css";

export default function MultiSelect({ items, title, typeItem, selectedItems, setSelectedItems }) {
    const [search, setSearch] = useState("");

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) &&
        !selectedItems.some(selected => selected.id === item.id)
    );

    const addItem = (item) => {
        console.log("Temas antes de adicionar ", selectedItems);
        setSelectedItems(prev => [...prev, item]);
        console.log("Temas depois de adicionar ", selectedItems);
        setSearch("");
    };

    const removeItem = (itemId) => {
        setSelectedItems(prev => prev.filter(item => item.id !== itemId));
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
        <div className={styles.container}>
            <label>{title}</label>
            <input
                type="text"
                placeholder="Digite para buscar..."
                value={search}
                className={styles.searchInput}
                onChange={e => setSearch(e.target.value)}
            />

            {search && (
                <div className={styles.dropdown}>
                    {filteredItems.length > 0 ? (
                        filteredItems.map(item => (
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
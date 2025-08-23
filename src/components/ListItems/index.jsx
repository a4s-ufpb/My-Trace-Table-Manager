import { BsPencil, BsTrash } from "react-icons/bs";
import styles from "./styles.module.css";
import { useState } from "react";
import AttentionPopUp from "../AttentionPopUp";

export default function ListItems({ items, removeItem, itemType, showId, title, onEdit, editingId }) {
    const [openPopUp, setOpenPopUp] = useState(false);
    const [itemId, setItemId] = useState(null);

    const startEditing = (item) => {
        if (onEdit) {
            onEdit(item)
        }
    };

    const shownPopUp = (itemId) => {
        setOpenPopUp(true);
        setItemId(itemId);
    }

    const popUpText = itemType === "theme" ?
        "Tem certeza que deseja excluir este tema? Não será possível recuperá-lo! Exercícios que têm apenas este tema serão excluídos e os que possuem mais temas serão desassociados deste!" :
        "Tem certeza que deseja excluir este professor? Não será possível recuperá-lo!"

    return (
        <div className={styles.container}>
            <h4>{title}</h4>
            <div className={styles.listItems}>
                {items.map((item) => (
                    <div key={item.id} className={`${styles.item} ${editingId === item.id ? styles.itemEditing : ''}`} data-testid={`list-item-${item.id}`}>
                        <span>
                            {showId && <span title="Código" className={styles.itemId}>{item.id}</span>}{item.name}
                        </span>
                        <div className={styles.icons}>
                            <BsPencil
                                className="icon-pencil"
                                onClick={() => startEditing(item)}
                                role="button"
                                aria-label={`Editar ${item.name}`}
                            />
                            <BsTrash
                                className="icon-trash"
                                onClick={() => shownPopUp(item.id)}
                                role="button"
                                aria-label={`Excluir ${item.name}`}
                            />
                        </div>
                    </div>
                ))}
            </div>
            {openPopUp && (
                <AttentionPopUp
                    text={popUpText}
                    confirmAction={() => {
                        removeItem(itemId)
                        setOpenPopUp(false);
                        setItemId(null);
                    }}
                    cancelAction={() => setOpenPopUp(false)}
                />
            )}
        </div>
    );
}

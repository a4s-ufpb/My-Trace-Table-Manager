import { BsPencil, BsTrash } from "react-icons/bs";
import styles from "./styles.module.css";
import { useState } from "react";
import AttentionPopUp from "../AttentionPopUp";

export default function ListItems({ items, removeItem, itemType, showId, title, onEdit }) {
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
                    <div key={item.id} className={styles.item}>
                        <span>
                            {item.name}{showId && <span title="Código do tema" className={styles.itemId}>{item.id}</span>}
                        </span>
                        <div className={styles.icons}>
                            <BsPencil
                                className="icon-pencil"
                                onClick={() => startEditing(item)}
                            />
                            <BsTrash
                                className="icon-trash"
                                onClick={() => shownPopUp(item.id)}
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

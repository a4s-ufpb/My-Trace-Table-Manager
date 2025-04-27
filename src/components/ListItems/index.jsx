import { BsCheck2, BsPencil, BsTrash } from "react-icons/bs";
import styles from "./styles.module.css";
import { useState } from "react";
import AttentionPopUp from "../AttentionPopUp";

export default function ListItems({ items, removeItem, itemType, editItem, title }) {
    const [editedName, setEditedName] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [openPopUp, setOpenPopUp] = useState(false);
    const [itemId, setItemId] = useState(null);

    const startEditing = (item) => {
        setEditingId(item.id);
        setEditedName(item.name);
    };

    const saveEdit = () => {
        editItem(editingId, { name: editedName });
        setEditingId(null);
        setEditedName("");
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
                        {editingId === item.id ? (
                            <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className={styles.editInput}
                            />
                        ) : (
                            <span>{item.name}</span>
                        )}
                        <div className={styles.icons}>
                            {editingId === item.id ? (
                                <BsCheck2
                                    className="icon-check"
                                    onClick={saveEdit}
                                />
                            ) : (
                                <BsPencil
                                    className="icon-pencil"
                                    onClick={() => startEditing(item)}
                                />
                            )}
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

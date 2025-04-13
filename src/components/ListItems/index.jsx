import { BsCheck2, BsPencil, BsTrash } from "react-icons/bs";
import styles from "./styles.module.css";
import { useState } from "react";

export default function ItemList({ items, removeItem, editItem, title }) {
    const [editedName, setEditedName] = useState("");
    const [editingId, setEditingId] = useState(null);

    const startEditing = (item) => {
        setEditingId(item.id);
        setEditedName(item.name);
    };

    const saveEdit = () => {
        editItem(editingId, { name: editedName });
        setEditingId(null);
        setEditedName("");
    };

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
                                onClick={() => removeItem(item.id)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

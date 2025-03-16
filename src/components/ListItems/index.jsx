import { BsTrash } from "react-icons/bs";
import styles from "./styles.module.css";

export default function ItemList({ items, removeItem, title }) {
    return (
        <div className={styles.container}>
            <h4>{title}</h4>
            <div className={styles.listItems}>
                {items.map((item) => (
                    <div key={item.id} className={styles.item}>
                        <span>{item.name}</span>
                        <BsTrash
                            className="icon-trash"
                            onClick={() => removeItem(item.id)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

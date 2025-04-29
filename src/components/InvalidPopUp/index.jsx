import { useEffect, useState } from "react";
import styles from "./styles.module.css";

export default function InvalidPopUp({ message, showPopUp }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                showPopUp(false);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [message, showPopUp]);

    if (!visible) return null;

    return (
        <div className={styles.invalidPopUp}>
            {message}
        </div>
    );
}
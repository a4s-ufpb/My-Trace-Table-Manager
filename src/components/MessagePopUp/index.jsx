import { useEffect, useState } from "react";
import styles from "./styles.module.css";

export default function MessagePopUp({ message, showPopUp }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                showPopUp(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message, showPopUp]);

    if (!visible) return null;

    return (
        <div className={styles.invalidPopUp}>
            {Array.isArray(message) ? (
                <ul>
                    {message.map((msg, index) => (
                        <li key={index}>{msg}</li>
                    ))}
                </ul>
            ) : (
                <span>{message}</span>
            )}
        </div>
    );
}
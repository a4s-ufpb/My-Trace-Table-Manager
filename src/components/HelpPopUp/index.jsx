import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

export default function HelpPopUp({ text, onClose }) {
    const navigate = useNavigate();
    return (
        <div className={styles.overlay}>
            <div className={styles.popUp}>
                <div className={styles.header}>
                    <span className={styles.title}>Ajuda</span>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>
                <p className={styles.textPopUp}>{text}</p>
                <button className={styles.btnNext} onClick={() => navigate("/help-page")}>Mais informações</button>
            </div>
        </div>
    );
}

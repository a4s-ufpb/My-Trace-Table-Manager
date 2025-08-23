import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

export default function HelpPopUp({ text, onClose }) {
    const navigate = useNavigate();
    return (
        <div className={styles.overlay} data-testid="help-popup">
            <div className={styles.popUp}>
                <div className={styles.header}>
                    <span className={styles.title}>Ajuda</span>
                    <button className={styles.closeBtn} onClick={onClose} data-testid="help-popup-close-button">×</button>
                </div>
                <p className={styles.textPopUp}>{text}</p>
                <button className={styles.btnNext} onClick={() => navigate("/help-page")} data-testid="help-popup-more-info">Mais informações</button>
            </div>
        </div> 
    );
}

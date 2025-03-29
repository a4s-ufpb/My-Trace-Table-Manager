import styles from "./styles.module.css";

export default function AttentionPopUp({ text, confirmAction, cancelAction}) {
    return (
        <div className={styles.overlay}>
            <div className={styles.popUp}>
                <span className={styles.popUpTitle}>Atenção</span>
                <p className={styles.textPopUp}>{text}</p>
                <div className="btn-container">
                    <button className={styles.btnNext} onClick={confirmAction}>Confirmar</button>
                    <button onClick={cancelAction} className={styles.btnCancel}>Cancelar</button>
                </div>
            </div>
        </div>
    )
} 
import styles from "./styles.module.css";

export default function PopUp({ text, confirmAction, cancelAction}) {
    return (
        <div className={styles.popUp}>
            <p className={styles.textPopUp}>{text}</p>
            <div className="btn-container">
                <button className="btn-next" onClick={confirmAction}>Confirmar</button>
                <button onClick={cancelAction} className="btn-cancel">Cancelar</button>
            </div>
        </div>
    )
}
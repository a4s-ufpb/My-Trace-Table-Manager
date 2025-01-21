import styles from "./styles.module.css"

export default function Button({ action, text }) {
    return (
        <button onClick={action} className={styles.button}>
            {text}
        </button>
    )
}
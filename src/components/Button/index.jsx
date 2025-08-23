import styles from "./styles.module.css"

export default function Button({ action, text, ...props }) {
    return (
        <button onClick={action} className={styles.button} {...props}>
            {text}
        </button>
    )
}
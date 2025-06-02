import styles from "./styles.module.css";

export default function HelpSection({ sectionId, title, text, images }) {

    const imagesArray = Array.isArray(images) ? images : images ? [images] : [];

    return (
        <div className={styles.content}>
            <section id={sectionId} className={styles.helpSection}>
                <h3>{title}</h3>
                <div className={styles.textContent}>
                    {text}
                </div>
                {imagesArray.length > 0 && (
                    <div className={styles.imagesContainer}>
                        {imagesArray.map((img, index) => (
                            <img key={index} src={img.src} alt={img.alt || `Imagem ${index + 1}`} className={styles.image} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
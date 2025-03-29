import styles from "./styles.module.css";
import imgAyla from "/ayla.jpg";
import imgAnna from "/anna.jpg";
import imgElk from "/elksandro.jpg";

export default function About() {
  return (
    <div className={styles.aboutContainer}>
      <div className={styles.aboutSection}>
        <img src={imgAyla} alt="Ayla Dantas" className={styles.aboutImage} />
        <p>
          O projeto foi orientado pela professora <strong>Ayla Dantas</strong>.
        </p>
      </div>

      <div className={styles.aboutSection}>
        <img src={imgAnna} alt="Anna Gabriela" className={styles.aboutImage} />
        <p>
          O projeto foi desenvolvido pela aluna <strong>Anna Gabriela</strong> do curso de Sistemas de Informação.
        </p>
      </div>

      <div className={styles.aboutSection}>
        <img src={imgElk} alt="José Elksandro" className={styles.aboutImage} />
        <p>
          O projeto foi desenvolvido pelo aluno <strong>José Elksandro</strong> do curso de Sistemas de Informação.
        </p>
      </div>
    </div>
  );
}
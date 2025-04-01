import styles from "./styles.module.css";
import imgAyla from "/ayla.jpg";
import imgAnna from "/anna.jpg";
import imgElk from "/elksandro.jpg";

export default function About() {
  return (
    <div className="background">
        <div className={styles.aboutSection}>
          <img src={imgAyla} alt="Ayla Dantas" className={styles.aboutImage} />
          <p className={styles.aboutText}>
            O projeto foi orientado pela professora <span>Ayla Dantas</span>.
          </p>
        </div>

        <div className={styles.aboutSection}>
          <img src={imgAnna} alt="Anna Gabriela" className={styles.aboutImage} />
          <p className={styles.aboutText}>
            O projeto foi desenvolvido pela aluna <span>Anna Gabriela</span> do curso de Sistemas de Informação.
          </p>
        </div>

        <div className={styles.aboutSection}>
          <img src={imgElk} alt="José Elksandro" className={styles.aboutImage} />
          <p className={styles.aboutText}>
            O projeto foi desenvolvido pelo aluno <span>José Elksandro</span> do curso de Sistemas de Informação.
          </p>
        </div>
    </div>

  );
}
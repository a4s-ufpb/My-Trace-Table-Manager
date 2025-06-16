import styles from "./styles.module.css";
import imgAyla from "/ayla.jpg";
import imgAnna from "/anna.jpg";
import imgElk from "/elksandro.jpg";

export default function About() {
  return (
    <div className="background">
      <div className={styles.wrapper}>
        <h2>Sobre</h2>

        <p className={styles.aboutDescription}>O <span className={styles.span}>My Trace Table Manager</span> é uma aplicação desenvolvida como parte do projeto <span className={styles.span}>Apps4Society</span>, da UFPB Campus IV, que tem como objetivo construir aplicativos e sistemas que impactam positivamente a sociedade. O objetivo da aplicação é fornecer aos professores uma ferramenta eficiente para cadastrar e gerenciar exercícios de teste de mesa, permitindo que os alunos pratiquem a resolução de algoritmos de maneira interativa e prática.</p>

        <div className={styles.aboutSection}>
          <img src={imgAyla} alt="Ayla Dantas" className={styles.aboutImage} />
          <p className={styles.aboutText}>
            A aplicação foi orientada pela professora <span className={styles.span}>Ayla Dantas</span>,
            coordenadora das ações do projeto e responsável pela orientação pedagógica.
          </p>
        </div>

        <div className={styles.aboutSection}>
          <img src={imgAnna} alt="Anna Gabriela" className={styles.aboutImage} />
          <p className={styles.aboutText}>
            A aplicação foi desenvolvida pela aluna <span className={styles.span}>Anna Gabriela</span> do curso de Sistemas de Informação.
          </p>
        </div>

        <div className={styles.aboutSection}>
          <img src={imgElk} alt="José Elksandro" className={styles.aboutImage} />
          <p className={styles.aboutText}>
            A aplicação também foi desenvolvida pelo aluno <span className={styles.span}>José Elksandro</span> do curso de Sistemas de Informação.
          </p>
        </div>
      </div>
    </div>

  );
}
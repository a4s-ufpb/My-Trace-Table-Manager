import styles from "./styles.module.css";
import imgAyla from "/ayla.jpg";
import imgAnna from "/anna.jpg";
import imgElk from "/elksandro.jpg";
import imgRony from "/ronyelison.jpg";


export default function About() {
  return (
    <div className="background">
      <div className={styles.wrapper}>
        <h2>Sobre</h2>

        <p className={styles.description}>O <span className={styles.span}>My Trace Table Manager</span> é uma aplicação desenvolvida como parte do projeto <span className={styles.span}>Apps4Society</span>, da UFPB Campus IV, que tem como objetivo construir aplicativos e sistemas que impactam positivamente a sociedade. A ideia da aplicação é fornecer aos professores uma ferramenta eficiente para cadastrar e gerenciar exercícios de teste de mesa, permitindo que os alunos pratiquem a resolução de algoritmos de maneira interativa e prática.</p>

        <p className={styles.description}>A ideia de testes de mesa digitais vem de trabalhos de TCC orientados pela professora Ayla Dantas Rebouças, como o de <a href="https://drive.google.com/file/d/1jctcgeqFaJXe99s-YR-gyrm4B-C9Fsi9/view" target="_blank">Josinaldo Silva</a>, <a href="https://drive.google.com/file/d/1Ka-vqvY3T3M0S7I3xjbJQK_2u7MB_d4W/view" target="_blank">Diego Tavares</a> e <a href="https://drive.google.com/file/d/1Ez-aqusmi8qApLEDX7I4CKMjVeZx4Z3f/view" target="_blank">Pedro Gomes</a>, inspirados em atividades realizadas pela professora Vanessa Dantas. No projeto Apps4Society, na vigência 2024-2025, o desenvolvimento deste sitema Web foi conduzido incialmente pelo estudante Ronyelison Abreu e em seguida pelos estudantes Anna Gabriela e José Elksandro, do curso de Sistemas de Informação. O My Trace Table Manager foi construido sob orientação da professora Ayla Dantas Rebouças, coordenadora do projeto.</p>

        <div className={styles.participantContainer}>
          <div>
            <img src={imgAyla} alt="Ayla Dantas" className={styles.image} />
            <p className={styles.participantName}>Ayla Rebouças</p>
          </div>

          <div>
            <img src={imgAnna} alt="Anna Gabriela" className={styles.image} />
            <p className={styles.participantName}>Anna Gabriela</p>
          </div>

          <div>
            <img src={imgElk} alt="José Elksandro" className={styles.image} />
            <p className={styles.participantName}>José Elksandro</p>
          </div>

          <div>
            <img src={imgRony} alt="Ronyelison Abreu" className={styles.image} />
            <p className={styles.participantName}>Ronyelison Abreu</p>
          </div>
        </div>
      </div>
    </div>

  );
}
import { useParams, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import useTraceTableCollection from "../../hooks/useTraceTableCollection";

export default function ExerciseDetails() {
    const { traceTables } = useTraceTableCollection();
    const { id } = useParams();
    const navigate = useNavigate();

    if (!traceTables) return <p>Carregando...</p>;

    const exercise = traceTables.find((ex) => ex.id === parseInt(id));

    if (!exercise) return <p>Exercício não encontrado!</p>;

    return (
        <div className="background">
            <div className={styles.detailsContainer}>
                <h2>Exercício: {exercise.id}</h2>
                <span className="table-subtitle"><strong>Temas:</strong> {exercise.themes.join(", ")}</span>
                <div className="img-container">
                    <img src={exercise.img} alt="Exercício" />
                </div>

                <h3 className="table-title">Tabela Mostrada</h3>
                <table border="1">
                    <thead>
                        <tr>
                            {exercise.header.map((col, index) => (
                                <th key={index}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {exercise.shownTable.map((row, i) => (
                            <tr key={i}>
                                <td>{i + 1}º</td>
                                {row.map((cell, j) => (
                                    <td key={j} className={cell === "#" ? "disabled-cell" : ""}>
                                        {cell !== "#" && cell !== "?" ? cell : ""}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h3 className="table-title">Tabela Esperada</h3>
                <table border="1">
                    <thead>
                        <tr>
                            {exercise.header.map((col, index) => (
                                <th key={index}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {exercise.expectedTable.map((row, i) => (
                            <tr key={i}>
                                <td>{i + 1}º</td>
                                {row.map((cell, j) => (
                                    <td key={j} className={cell === "#" ? "disabled-cell" : ""}>
                                        {cell !== "#" ? cell : ""}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button className="btn" onClick={() => navigate("/list-exercises")}>
                    Voltar
                </button>
            </div>
        </div>
    );
}

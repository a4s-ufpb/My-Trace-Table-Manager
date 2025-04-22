import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { BsTrash, BsPencil } from "react-icons/bs";

export default function ListExercises({ exercises, themesMap, editExercise, removeExercise }) {

    const navigate = useNavigate();

    return (
        <div className={styles.content}>
            <div className={styles.listContainer}>
                <h2>Lista de Exercícios</h2>
                <div className={styles.cards}>
                    {exercises.map((exercise) => (
                        <div key={exercise.id} className={styles.card}>
                            <div className={styles.titleAndIcons}>
                                <h3 className="table-title">Exercício: {exercise.id}</h3>
                                <div className={styles.icons}>
                                    <BsPencil
                                        className="icon-pencil"
                                        onClick={() => navigate(`/`)}
                                    />
                                    <BsTrash
                                        className="icon-trash"
                                        onClick={() => removeExercise(exercise.id)}
                                    />
                                </div>
                            </div>
                            <span className="table-subtitle"><strong>Temas: </strong>{themesMap[exercise.id]?.join(", ") || "Carregando..."}</span>
                            <div className={styles.btnContainer}>
                                <button
                                    className="btn"
                                    onClick={() => navigate(`/exercicio/${exercise.id}`)}
                                >Ver</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <button className="btn" onClick={() => navigate("/")}>
                Voltar
            </button>
        </div>
    );

}

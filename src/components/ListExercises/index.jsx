import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { BsTrash } from "react-icons/bs";
import { useState } from "react";
import AttentionPopUp from "../AttentionPopUp";

export default function ListExercises({ exercises, themesMap, removeExercise }) {

    const [openPopUp, setOpenPopUp] = useState(false);
    const [exerciseId, setExerciseId] = useState(null);

    const navigate = useNavigate();

    const shownPopUp = (exerciseId) => {
        setOpenPopUp(true);
        setExerciseId(exerciseId);
    }

    return (
        <div className={styles.content}>
            <div className={styles.listContainer}>
                <h2 className={styles.title}>Lista de Exercícios</h2>
                <div className={styles.cards}>
                    {exercises.map((exercise) => (
                        <div key={exercise.id} className={styles.card}>
                            <div className={styles.titleAndIcons}>
                                <h3 className="table-title">{exercise.exerciseName}</h3>
                                <BsTrash
                                    className="icon-trash"
                                    onClick={() => shownPopUp(exercise.id)}
                                />
                            </div>
                            <span className="table-themes"><strong>Temas: </strong>{themesMap[exercise.id]?.join(", ") || "Carregando..."}</span>
                            <div className={styles.btnContainer}>
                                <button
                                    className="btn"
                                    onClick={() => navigate(`/exercicio/${exercise.id}`)}
                                >Ver</button>
                                <button
                                    className="btn"
                                    onClick={() => navigate(`/exercicio/${exercise.id}?edit=true`)
                                    }
                                >Editar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {openPopUp && (
                <AttentionPopUp
                    text="Tem certeza que deseja excluir este exercício? Não será possível recuperá-lo!"
                    confirmAction={() => {
                        removeExercise(exerciseId)
                        setOpenPopUp(false);
                        setExerciseId(null);
                    }}
                    cancelAction={() => setOpenPopUp(false)}
                />
            )}
        </div>
    );
}

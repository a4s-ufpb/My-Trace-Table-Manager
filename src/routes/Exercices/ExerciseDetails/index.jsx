import { useParams, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import useTraceTableCollection from "../../../hooks/useTraceTableCollection";
import useThemeCollection from "../../../hooks/useThemeCollection";
import { useEffect, useState } from "react";

export default function ExerciseDetails() {
    const { traceTables, editTraceTable } = useTraceTableCollection();
    const { id } = useParams();
    const [exercise, setExercise] = useState(null);
    const [hasStep, setHasStep] = useState(false);
    const [imageURL, setImageURL] = useState(null);
    const [exerciseName, setExerciseName] = useState("");
    const navigate = useNavigate();

    const [shownTraceTable, setShownTraceTable] = useState([]);
    const [expectedTraceTable, setExpectedTraceTable] = useState([]);
    const [typeTable, setTypeTable] = useState([]);
    const [header, setHeader] = useState([]);

    const [editingId, setEditingId] = useState(null);

    const [themesExercise, setThemesExercise] = useState([]);
    const { getThemesByExercise } = useThemeCollection();

    useEffect(() => {
        const fetchThemes = async () => {
            const themes = await getThemesByExercise(id);
            setThemesExercise(themes.map(theme => theme.name));
        };

        if (id) {
            fetchThemes();
        }

        const foundExercise = traceTables.find(ex => ex.id === parseInt(id));
        if (foundExercise) {
            const hasStep = foundExercise.header.some(h => h.toLowerCase().includes("passo"));
            setHasStep(hasStep);
        }
        setExercise(foundExercise);

        setExerciseName(foundExercise?.exerciseName || "");
        setShownTraceTable(foundExercise?.shownTraceTable || []);
        setExpectedTraceTable(foundExercise?.expectedTraceTable || []);
        setTypeTable(foundExercise?.typeTable || []);
        setHeader(foundExercise?.header || []);
    }, [id, traceTables]);

    useEffect(() => {
        if (exercise?.imgPath) {
            setImageURL(exercise.imgPath);
        }
    }, [exercise?.imgPath]);


    if (!exercise) return (
        <div className="background">
            <p>Exercício não encontrado!</p>;
        </div>
    )

    const startEditing = (item) => {
        setEditingId(item.id);
    };

    const saveEdit = () => {
        editTraceTable(editingId, { exerciseName, expectedTraceTable, shownTraceTable, typeTable, header });
        setEditingId(null);
        setExpectedTraceTable([]);
        setShownTraceTable([]);
        setTypeTable([]);
        setHeader([]);
        navigate("/list-exercises");
    };

    const handleInputChange = (row, col, value, tableType) => {
        if (tableType === "shown") {
            setShownTraceTable(prevData => {
                const newTableData = prevData.map((r, i) =>
                    i === row ? r.map((c, j) => (j === col ? value : c)) : r
                );
                console.log(newTableData);

                setExpectedTraceTable(prevExpected => {
                    const updatedExpected = prevExpected.map((r, i) =>
                        i === row
                            ? r.map((c, j) => (j === col && value !== "?" ? value : c))
                            : r
                    );
                    return updatedExpected;
                });

                setTypeTable(prevTypeTable => {
                    const updatedTypeTable = prevTypeTable.map((r, i) =>
                        i === row ? r.map((c, j) => {
                            if (j === col && value === "#") {
                                return "#";
                            } else if (j === col && value !== "#") {
                                return "String";
                            }
                            return c;
                        }) : r
                    );
                    return updatedTypeTable;
                });

                return newTableData;
            });
        } else {
            if (shownTraceTable[row][col] === "?") {
                setExpectedTraceTable(prevData => {
                    const newTableData = prevData.map((r, i) =>
                        i === row ? r.map((c, j) => (j === col ? value : c)) : r
                    );
                    console.log(newTableData);
                    return newTableData;
                });
            }
        }
    };

    const handleSelectChange = (row, col, value) => {
        setTypeTable(prevData => {
            const newTableData = prevData.map((r, i) =>
                i === row ? r.map((c, j) => (j === col ? value : c)) : r
            );
            return newTableData;
        });

        console.log(typeTable);
    };

    const handleHeaderChange = (col, value) => {
        setHeader(prevHeader => {
            const newHeader = [...prevHeader];
            newHeader[col] = value;
            return newHeader;
        });
    }

    return (
        <div className="background">
            <div className={styles.detailsContainer}>
                <h2>{exercise.exerciseName}</h2>
                <span className="table-subtitle"><strong>Temas:</strong> {themesExercise.join(", ")}</span>
                {imageURL && (
                    <div className="img-container">
                        <img src={imageURL} alt="Código do exercício" />
                    </div>
                )}

                <h3 className="table-title">Tabela Mostrada</h3>
                <table border="1">
                    <thead>
                        <tr>
                            {header.map((col, index) => (
                                <th key={index}>
                                    {editingId ? (
                                        (hasStep ? index > 1 : index > 0) ? (
                                            <input
                                                type="text"
                                                value={col}
                                                onChange={(e) => handleHeaderChange(index, e.target.value)}
                                                maxLength={10}
                                            />
                                        ) : col
                                    ) : col
                                    }
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {shownTraceTable.map((row, i) => (
                            <tr key={i}>
                                {hasStep &&
                                    <td className="step-cell">{i + 1}º</td>
                                }
                                {row.map((cell, j) => (
                                    <td key={j} className={cell === "#" ? "disabled-cell" : ""}>
                                        {editingId !== null ? (
                                            <input
                                                type="text"
                                                value={cell}
                                                onChange={(e) => handleInputChange(i, j, e.target.value, "shown")}
                                                maxLength={10}
                                            />
                                        ) : (
                                            cell !== "#" && cell !== "?" ? cell : ""
                                        )}
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
                            {header.map((col, index) => (
                                <th key={index}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {expectedTraceTable.map((row, i) => (
                            <tr key={i}>
                                {hasStep &&
                                    <td className="step-cell">{i + 1}º</td>
                                }
                                {row.map((cell, j) => (
                                    <td key={j} className={shownTraceTable[i][j] === "#" ? "disabled-cell" : ""}>
                                        {editingId !== null && shownTraceTable[i][j] !== "#" ? (
                                            <input
                                                type="text"
                                                value={
                                                    shownTraceTable[i][j] === "?" ? cell : shownTraceTable[i][j]}
                                                onChange={(e) => handleInputChange(i, j, e.target.value, "expected")}
                                                maxLength={8}
                                            />
                                        ) : (
                                            cell !== "#" ? cell : ""
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h3 className="table-title">Tabela de Tipos</h3>
                <table border="1">
                    <thead>
                        <tr>
                            {header.map((col, index) => (
                                <th key={index}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {typeTable.map((row, i) => (
                            <tr key={i}>
                                {hasStep &&
                                    <td className="step-cell">{i + 1}º</td>
                                }
                                {row.map((cell, j) => (
                                    <td key={j} className={shownTraceTable[i][j] === "#" ? "disabled-cell" : ""}>
                                        {editingId !== null && shownTraceTable[i][j] !== "#" ? (
                                            <select
                                                name="valueType"
                                                id="valueType"
                                                value={shownTraceTable[i][j] !== "#" ? cell : ""}
                                                onChange={(e) => handleSelectChange(i, j, e.target.value)}
                                            >
                                                <option value="String">String</option>
                                                <option value="int">int</option>
                                                <option value="double">double</option>
                                                <option value="float">float</option>
                                                <option value="boolean">boolean</option>
                                            </select>
                                        ) : (
                                            cell !== "#" ? cell : ""
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="btn-container">
                    {editingId !== null ? (
                        <>
                            <button className="btn" onClick={saveEdit}>
                                Salvar
                            </button>
                            <button className="btn" onClick={() => {
                                setEditingId(null);
                                setShownTraceTable(exercise.shownTraceTable || []);
                                setExpectedTraceTable(exercise.expectedTraceTable || []);
                                setHeader(exercise.header || []);
                            }}>
                                Cancelar
                            </button>

                        </>
                    ) : (
                        <button className="btn" onClick={() => startEditing(exercise)}>
                            Editar
                        </button>
                    )}
                    <button className="btn" onClick={() => navigate("/list-exercises")}>
                        Voltar
                    </button>
                </div>

            </div>
        </div>
    );
}

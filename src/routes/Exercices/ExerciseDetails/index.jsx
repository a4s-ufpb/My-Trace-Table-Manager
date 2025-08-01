import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { BsQuestionCircleFill } from "react-icons/bs";
import HelpPopUp from "../../../components/HelpPopUp";
import ImageModal from "../../../components/ImageModal";
import { TraceTableService } from "../../../service/TraceTableService";
import { ThemeService } from "../../../service/ThemeService";
import MessagePopUp from "../../../components/MessagePopUp";
import { useUnloadWarning } from "../../../hooks/useUnloadWarning";


export default function ExerciseDetails() {
    const [searchParams] = useSearchParams();
    const isEditing = searchParams.get("edit") === "true";
    const { id } = useParams();
    const navigate = useNavigate();

    const [exercise, setExercise] = useState(null);
    const [originalExercise, setOriginalExercise] = useState(null);
    const [shownTraceTable, setShownTraceTable] = useState([]);
    const [expectedTraceTable, setExpectedTraceTable] = useState([]);
    const [typeTable, setTypeTable] = useState([]);
    const [header, setHeader] = useState([]);
    const [exerciseName, setExerciseName] = useState("");
    const [imageURL, setImageURL] = useState(null);
    const [editingId, setEditingId] = useState(isEditing ? parseInt(id) : null);
    const [hasStep, setHasStep] = useState(false);
    const [hasRow, setHasRow] = useState(false);
    const [themesExercise, setThemesExercise] = useState([]);

    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState("");
    const [openHelpPopUp, setOpenHelpPopUp] = useState(false);
    const [helpText, setHelpText] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const traceTableService = new TraceTableService();
    const themeService = new ThemeService();

    useUnloadWarning(editingId !== null);

    useEffect(() => {
        const fetchData = async () => {
            const themesResponse = await themeService.getThemesByExercise(id);
            if (themesResponse.success) {
                setThemesExercise(themesResponse.data.content.map(t => t.name));
            }

            const allExercisesResponse = await traceTableService.getAllByUser(traceTableService.getUserId());
            if (allExercisesResponse.success) {
                const found = allExercisesResponse.data.content.find(ex => ex.id === parseInt(id));
                if (found) {
                    const step = found.header.some(h => h.toLowerCase().includes("passo"));
                    const row = found.header.some(h => h.toLowerCase().includes("linha"));
                    setHasStep(step);
                    setHasRow(row);
                    setExercise(found);
                    setOriginalExercise(JSON.parse(JSON.stringify(found)));
                    setExerciseName(found.exerciseName || "");
                    setShownTraceTable(found.shownTraceTable || []);
                    setExpectedTraceTable(found.expectedTraceTable || []);
                    setTypeTable(found.typeTable || []);
                    setHeader(found.header || []);
                }
            }
        };

        if (id) fetchData();
    }, [id]);

    useEffect(() => {
        if (exercise?.imgName) {
            setImageURL(exercise.imgName);
        }
    }, [exercise?.imgName]);

    const skipIndex = (hasStep ? 1 : 0) + (hasRow ? 1 : 0);

    const saveEdit = async () => {
        const updatedData = { exerciseName, expectedTraceTable, shownTraceTable, typeTable, header };
        await traceTableService.editTraceTable(editingId, updatedData);
        setEditingId(null);
        setPopUpMessage("Exercício atualizado com sucesso!");
        setShowMessagePopUp(true);
        navigate("/list-exercises");
    };

    const cancelEdit = () => {
        setEditingId(null);
        setShownTraceTable(originalExercise.shownTraceTable || []);
        setExpectedTraceTable(originalExercise.expectedTraceTable || []);
        setTypeTable(originalExercise.typeTable || []);
        setHeader(originalExercise.header || []);
        setExercise(JSON.parse(JSON.stringify(originalExercise)));
    }

    const handleInputChange = (row, col, value, tableType) => {
        if (tableType === "shown") {
            setShownTraceTable(prevData => {
                const newTableData = prevData.map((r, i) =>
                    i === row ? r.map((c, j) => (j === col ? value : c)) : r
                );

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
                                return "string";
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
                    return newTableData;
                });
                setTypeTable(prevData => {
                    const newTableData = prevData.map((r, i) =>
                        i === row ? r.map((c, j) => (j === col ? "string" : c)) : r
                    );
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
    };

    const handleHeaderChange = (col, value) => {
        setHeader(prevHeader => {
            const newHeader = [...prevHeader];
            newHeader[col] = value;
            return newHeader;
        });
    }

    const getValidTypeOptions = (value) => {
        const validTypes = [];

        if (/^-?\d+$/.test(value)) {
            validTypes.push("int");
        } else if (/^-?\d+(\.\d+)?$/.test(value)) {
            validTypes.push("double", "float");
        } else if (value === "true" || value === "True" || value === "false" || value === "False") {
            validTypes.push("boolean");
        }

        validTypes.push("string");

        return validTypes;
    };

    const handleImageClick = () => setIsModalOpen(true);

    const handleCloseModal = () => setIsModalOpen(false);

    const showHelpPopUp = (message) => {
        setHelpText(message);
        setOpenHelpPopUp(true);
    };

    if (!exercise) return (
        <div className="background">
            <p>Exercício não encontrado!</p>;
        </div>
    )

    const startEditing = (item) => {
        setEditingId(item.id);
    };

    return (
        <div className="background">
            <section className={styles.section}>
                <h2>{exercise.exerciseName}</h2>
                <span className="table-themes"><strong>Temas:</strong> {themesExercise.join(", ")}</span>
                {imageURL && (
                    <div className="img-container">
                        <img
                            src={imageURL}
                            alt="Código do exercício"
                            onClick={handleImageClick}
                        />
                    </div>
                )}
            </section>

            <section className={styles.section}>
                <div className="content-with-help">
                    <h2>Tabela Mostrada</h2>
                    <BsQuestionCircleFill className="icon-question" onClick={() => showHelpPopUp("O professor deve marcar as células que o aluno pode editar com '?'. As células que não podem ser alteradas devem ser preenchidas com '#'. Se quiser, também pode já deixar valores preenchidos nas células.")} />
                </div>
                <table border="1">
                    <thead>
                        <tr>
                            {header.map((col, index) => (
                                <th key={index}>
                                    {editingId ? (
                                        (hasStep && index >= skipIndex) ? (
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
            </section>

            <section className={styles.section}>
                <div className="content-with-help">
                    <h2>Tabela Esperada</h2>
                    <BsQuestionCircleFill className="icon-question" onClick={() => showHelpPopUp("O professor deve preencher a tabela com os valores esperados para a resposta do aluno. Essa tabela servirá como referência para a correção, comparando as respostas fornecidas com os resultados esperados.")} />
                </div>
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
                                        {editingId !== null && shownTraceTable[i][j] === "?" ? (
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
            </section>

            <section className={styles.section}>
                <div className="content-with-help">
                    <h2>Tabela de Tipos</h2>
                    <BsQuestionCircleFill className="icon-question" onClick={() => showHelpPopUp("O professor deve preencher a tabela de tipos com o respectivo tipo de valor esperado em cada célula. Caso na criação do exercício o professor tenha optado previamente em não preencher a tabela de tipos, todas as células são consideradas String por padrão. A tipagem é interessante para a correção, pois permite que o sistema verifique se o tipo de dado enviado pelo aluno corresponde ao esperado, fornecendo um feedback mais preciso.")} />
                </div>
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
                                                {getValidTypeOptions(expectedTraceTable[i][j])
                                                    .map((type, index) => (
                                                        <option key={index} value={type}>
                                                            {type}
                                                        </option>
                                                    ))}
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
            </section>

            <section className={styles.section}>
                <div className="btn-container">
                    {editingId !== null ? (
                        <>
                            <button className="btn" onClick={saveEdit}>
                                Salvar
                            </button>
                            <button className="btn" onClick={cancelEdit}>
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
            </section>

            {openHelpPopUp && (
                <HelpPopUp
                    text={helpText}
                    onClose={() => setOpenHelpPopUp(false)}
                />
            )}

            <ImageModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                imageSrc={imageURL}
            />

            {showMessagePopUp && (
                <MessagePopUp
                    message={popUpMessage}
                    showPopUp={setShowMessagePopUp}
                />
            )}
        </div>
    );
}

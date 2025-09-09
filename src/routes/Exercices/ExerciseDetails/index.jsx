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
import { getValidTypesForValue, normalizeTypeTableForAPI, denormalizeTypeTableFromAPI } from "../../../utils/typeGuesser";
import Loading from "../../../components/Loading";
import MultiSelect from "../../../components/MultiSelect";

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
    const [programmingLanguage, setProgrammingLanguage] = useState("python");

    const [allThemes, setAllThemes] = useState([]);
    const [selectedThemes, setSelectedThemes] = useState([]);
    const [originalThemes, setOriginalThemes] = useState([]);

    const [columnOption, setColumnOption] = useState("");

    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState("");
    const [openHelpPopUp, setOpenHelpPopUp] = useState(false);
    const [helpText, setHelpText] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [loading, setLoading] = useState(true);

    const traceTableService = new TraceTableService();
    const themeService = new ThemeService();

    useUnloadWarning(editingId !== null);
    const defaultString = programmingLanguage === 'java' ? 'String' : 'str';

    const getColumnOptionValue = (step, row) => {
        if (step && row) return "both";
        if (step) return "steps";
        return "rows";
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const exerciseResponse = await traceTableService.getById(id);
                if (exerciseResponse.success) {
                    const found = exerciseResponse.data;

                    const lang = found.programmingLanguage || "python";
                    setProgrammingLanguage(lang);

                    const denormalizeTypeTable = denormalizeTypeTableFromAPI(found.typeTable || [], lang);
                    setTypeTable(denormalizeTypeTable);

                    const step = found.header.some(h => h.toLowerCase().includes("passo"));
                    const row = found.header.some(h => h.toLowerCase().includes("linha"));
                    setHasStep(step);
                    setHasRow(row);
                    setColumnOption(getColumnOptionValue(step, row));

                    setExercise(found);
                    setOriginalExercise(JSON.parse(JSON.stringify(found)));
                    setExerciseName(found.exerciseName || "");
                    setShownTraceTable(found.shownTraceTable || []);
                    setExpectedTraceTable(found.expectedTraceTable || []);
                    setHeader(found.header || []);

                    const themesResponse = await themeService.getThemesByExercise(id);
                    if (themesResponse.success) {
                        const initialThemes = themesResponse.data.content;
                        setThemesExercise(initialThemes.map(t => t.name));
                        setSelectedThemes(initialThemes);
                        setOriginalThemes(initialThemes);
                    }

                    const allThemesResponse = await themeService.findAllThemesByUser();
                    if (allThemesResponse.success) {
                        setAllThemes(allThemesResponse.data.content || []);
                    }
                } else {
                    setExercise(null);
                    setPopUpMessage(exerciseResponse.message || "Exercício não encontrado");
                    setShowMessagePopUp(true);
                }
            } catch (error) {
                setExercise(null);
                setPopUpMessage("Erro ao carregar o exercício. Tente novamente");
                setShowMessagePopUp(true);
            } finally {
                setLoading(false);
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
        const normalizedTypeTable = normalizeTypeTableForAPI(typeTable);
        const updatedData = {
            exerciseName,
            programmingLanguage,
            expectedTraceTable,
            shownTraceTable,
            typeTable: normalizedTypeTable,
            header,
        };

        const updatedThemesIds = selectedThemes.map(theme => theme.id)
        const response = await traceTableService.editTraceTable(editingId, updatedData, updatedThemesIds);

        if (response.success) {
            const confirmedExercise = response.data;

            setExercise(confirmedExercise);
            setOriginalExercise(JSON.parse(JSON.stringify(confirmedExercise)));
            setThemesExercise(selectedThemes.map(t => t.name));
            setOriginalThemes(selectedThemes);

            setEditingId(null);
            setPopUpMessage("Exercício atualizado com sucesso!");
            setShowMessagePopUp(true);
        } else {
            setPopUpMessage("Erro ao atualizar o exercício. Tente novamente.");
            setShowMessagePopUp(true);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setShownTraceTable(originalExercise.shownTraceTable || []);
        setExpectedTraceTable(originalExercise.expectedTraceTable || []);
        setHeader(originalExercise.header || []);
        setExerciseName(originalExercise.exerciseName || "");
        setExercise(JSON.parse(JSON.stringify(originalExercise)));
        setProgrammingLanguage(originalExercise.programmingLanguage || "python");
        setSelectedThemes(originalThemes);

        const originalHeader = originalExercise.header || [];
        const originalHasStep = originalHeader.some(h => h.toLowerCase().includes("passo"));
        const originalHasRow = originalHeader.some(h => h.toLowerCase().includes("linha"));

        setHasStep(originalHasStep);
        setHasRow(originalHasRow);
        setColumnOption(getColumnOptionValue(originalHasStep, originalHasRow));

        const rawTypeTable = originalExercise.typeTable || [];
        const lang = originalExercise.programmingLanguage || 'python';
        const denormalizedTypes = denormalizeTypeTableFromAPI(rawTypeTable, lang);
        setTypeTable(denormalizedTypes);
    }

    const handleInputChange = (rowIndex, colIndex, value, tableType) => {
        if (tableType === "shown") {
            setShownTraceTable(prevData => {
                const newTableData = prevData.map((r, i) =>
                    i === rowIndex ? r.map((c, j) => (j === colIndex ? value : c)) : r
                );

                setExpectedTraceTable(prevExpected => {
                    return prevExpected.map((r, i) =>
                        i === rowIndex
                            ? r.map((c, j) => (j === colIndex && value !== "?" ? value : c))
                            : r
                    );
                });

                setTypeTable(prevTypeTable => {
                    return prevTypeTable.map((r, i) =>
                        i === rowIndex ? r.map((c, j) => {
                            if (j === colIndex && value === "#") return "#";
                            if (j === colIndex && value !== "#") return defaultString;
                            return c;
                        }) : r
                    );
                });

                return newTableData;
            });
        }
        else if (tableType === "expected") {
            if (shownTraceTable[rowIndex][colIndex] === "?") {
                setExpectedTraceTable(prevData => {
                    return prevData.map((row, rIndex) =>
                        rIndex === rowIndex
                            ? row.map((cell, cIndex) => (cIndex === colIndex ? value : cell))
                            : row
                    );
                });

                setTypeTable(prevData => {
                    const validTypes = getValidTypesForValue(value, programmingLanguage);
                    const bestGuessType = validTypes[0];
                    return prevData.map((row, rIndex) =>
                        rIndex === rowIndex
                            ? row.map((cellType, cIndex) => (cIndex === colIndex ? bestGuessType : cellType))
                            : row
                    );
                });
            }
        }
    };

    const handleSelectChange = (rowIndex, colIndex, newType) => {
        setTypeTable(prevData => {
            const newTableData = prevData.map(r => [...r]);
            for (let i = rowIndex; i < newTableData.length; i++) {
                if (shownTraceTable[i][colIndex] !== "#") {
                    const cellValue = expectedTraceTable[i][colIndex];
                    const possibleTypes = getValidTypesForValue(cellValue, programmingLanguage);
                    if (possibleTypes.includes(newType)) {
                        newTableData[i][colIndex] = newType;
                    }
                }
            }
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

    const handleColumnOptionChange = (newOption) => {
        const newHasStep = newOption === 'both' || newOption === 'steps';
        const newHasRow = newOption === 'both' || newOption === 'rows';

        if (newHasStep === hasStep && newHasRow === hasRow) return;

        setHeader(prevHeader => {
            const variablaeColumns = prevHeader.filter(h =>
                !h.toLowerCase().includes("passo") && !h.toLowerCase().includes("linha")
            );

            const newHeaderArray = [];
            if (newHasStep) newHeaderArray.push("Passo");
            if (newHasRow) newHeaderArray.push("Linha");
            return [...newHeaderArray, ...variablaeColumns];
        });

        if (newHasRow !== hasRow) {
            const insertAtIndex = 0;

            if (newHasRow) {
                const defaultShowValue = "?";
                const defaultExpectedValue = "";
                const defaultTypeValue = defaultString;

                setShownTraceTable(prev => prev.map(row => {
                    const newRow = [...row];
                    newRow.splice(insertAtIndex, 0, defaultShowValue);
                    return newRow;
                }));

                setExpectedTraceTable(prev => prev.map(row => {
                    const newRow = [...row];
                    newRow.splice(insertAtIndex, 0, defaultExpectedValue);
                    return newRow;
                }));

                setTypeTable(prev => prev.map(row => {
                    const newRow = [...row];
                    newRow.splice(insertAtIndex, 0, defaultTypeValue);
                    return newRow;
                }));
            } else {
                const removeAtIndex = 0;

                setShownTraceTable(prev => prev.map(row => {
                    const newRow = [...row];
                    newRow.splice(removeAtIndex, 1);
                    return newRow;
                }));

                setExpectedTraceTable(prev => prev.map(row => {
                    const newRow = [...row];
                    newRow.splice(removeAtIndex, 1);
                    return newRow;
                }));

                setTypeTable(prev => prev.map(row => {
                    const newRow = [...row];
                    newRow.splice(removeAtIndex, 1);
                    return newRow;
                }));
            }
        }

        setHasStep(newHasStep);
        setHasRow(newHasRow);
        setColumnOption(newOption);
    };

    const handleImageClick = () => setIsModalOpen(true);

    const handleCloseModal = () => setIsModalOpen(false);

    const showHelpPopUp = (message) => {
        setHelpText(message);
        setOpenHelpPopUp(true);
    };

    if (loading) return (
        <div className="background">
            <Loading />
        </div>
    );

    if (!exercise) return (
        <div className="background">
            <p>Exercício não encontrado!</p>
        </div>
    )

    const startEditing = (item) => {
        setEditingId(item.id);

        const currentHasStep = item.header.some(h => h.toLowerCase().includes("passo"));
        const currentHasRow = item.header.some(h => h.toLowerCase().includes("linha"));
        setColumnOption(getColumnOptionValue(currentHasStep, currentHasRow));
    };

    const capitalizeFirstLetter = (string) => {
        if (!string) return "";
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const getColumnClasses = (columnName) => {
        const lowerCaseName = columnName.toLowerCase();
        const classes = [];

        if (lowerCaseName.includes('passo') || lowerCaseName.includes('linha')) {
            classes.push('metadata-column');
        }

        if (lowerCaseName.includes('linha')) {
            classes.push('metadata-column-divider');
        }

        return classes.join(' ');
    };

    return (
        <div className="background">
            <section className={styles.section}>
                {editingId ? (
                    <div className={styles.editForm}>
                        <div className={styles.formGroup}>
                            <label htmlFor="exerciseName" className={styles.exerciseNameLabel}>Nome do exercício:</label>
                            <input
                                type="text"
                                name="exerciseName"
                                id="exerciseName"
                                value={exerciseName}
                                className={styles.exerciseNameInput}
                                onChange={(e) => setExerciseName(e.target.value)}
                                minLength={1}
                                maxLength={30}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="columnOptions" className={styles.columnOptionsLabel}>Colunas Extras:</label>
                            <select
                                id="columnOptions"
                                name="columnOptions"
                                value={columnOption}
                                onChange={(e) => handleColumnOptionChange(e.target.value)}
                                className="form-input"
                            >
                                <option value="both">Mostrar Passo e Linha</option>
                                <option value="steps">Mostrar Apenas Passo</option>
                                <option value="rows">Mostrar Apenas Linha</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <MultiSelect
                                items={allThemes}
                                title={"Selecionar tema"}
                                typeItem={"temas"}
                                setSelectedItems={setSelectedThemes}
                                selectedItems={selectedThemes}
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <h2>{exerciseName}</h2>
                        <span className="table-themes"><strong>Temas:</strong> {themesExercise.join(", ")}</span>
                    </>
                )}
                <span className={styles.programmingLanguage}>Linguagem de Programação: {capitalizeFirstLetter(programmingLanguage)}</span>
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
                                <th key={index} className={getColumnClasses(col)}>
                                    {editingId ? (
                                        (index >= skipIndex) ? (
                                            <input
                                                id={`header-${index}`}
                                                name={`header-${index}`}
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
                                    <td className={`step-cell ${getColumnClasses('Passo')}`}>{i + 1}º</td>
                                }
                                {row.map((cell, j) => {
                                    const columnName = header[j + (hasStep ? 1 : 0)];
                                    const isDisabled = cell === "#";

                                    const cellClasses = [
                                        getColumnClasses(columnName),
                                        isDisabled ? 'disabled-cell' : ''
                                    ].join(' ').trim();

                                    return (
                                        <td key={j} className={cellClasses}>
                                            {editingId !== null ? (
                                                <input
                                                    id={`shown-${i}-${j}`}
                                                    name={`shown-${i}-${j}`}
                                                    type="text"
                                                    value={cell}
                                                    onChange={(e) => handleInputChange(i, j, e.target.value, "shown")}
                                                    maxLength={10}
                                                />
                                            ) : (
                                                cell !== "#" && cell !== "?" ? cell : ""
                                            )}
                                        </td>
                                    )
                                })}
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
                                <th key={index} className={getColumnClasses(col)}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {expectedTraceTable.map((row, i) => (
                            <tr key={i}>
                                {hasStep &&
                                    <td className={`step-cell ${getColumnClasses('Passo')}`}>{i + 1}º</td>
                                }
                                {row.map((cell, j) => {
                                    const columnName = header[j + (hasStep ? 1 : 0)];
                                    const isDisabled = shownTraceTable[i][j] === "#";

                                    const cellClasses = [
                                        getColumnClasses(columnName),
                                        isDisabled ? 'disabled-cell' : ''
                                    ].join(' ').trim();

                                    return (
                                        <td key={j} className={cellClasses}>
                                            {editingId !== null && shownTraceTable[i][j] === "?" ? (
                                                <input
                                                    id={`expected-${i}-${j}`}
                                                    name={`expected-${i}-${j}`}
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
                                    )
                                })}
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
                                <th key={index} className={getColumnClasses(col)}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {typeTable.map((row, i) => (
                            <tr key={i}>
                                {hasStep &&
                                    <td className={`step-cell ${getColumnClasses('Passo')}`}>{i + 1}º</td>
                                }
                                {row.map((cell, j) => {
                                    const columnName = header[j + (hasStep ? 1 : 0)];
                                    const isDisabled = shownTraceTable[i][j] === "#";

                                    const cellClasses = [
                                        getColumnClasses(columnName),
                                        isDisabled ? 'disabled-cell' : ''
                                    ].join(' ').trim();

                                    return (
                                        <td key={j} className={cellClasses}>
                                            {editingId !== null && shownTraceTable[i][j] === "?" ? (
                                                <select
                                                    id={`valueType-${i}-${j}`}
                                                    name={`valueType-${i}-${j}`}
                                                    value={shownTraceTable[i][j] !== "#" ? cell : ""}
                                                    onChange={(e) => handleSelectChange(i, j, e.target.value)}
                                                >
                                                    {getValidTypesForValue(expectedTraceTable[i][j], programmingLanguage)
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
                                    )
                                })}
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

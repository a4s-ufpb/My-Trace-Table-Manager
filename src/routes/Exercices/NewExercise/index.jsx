import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TraceTableContext } from "../../../contexts/TraceTableContext";
import styles from "./styles.module.css";
import { BsQuestionCircleFill } from "react-icons/bs";
import AttentionPopUp from "../../../components/AttentionPopUp";
import HelpPopUp from "../../../components/HelpPopUp";
import MultiSelect from "../../../components/MultiSelect";
import MessagePopUp from "../../../components/MessagePopUp";
import { ThemeService } from "../../../service/ThemeService";
import { TraceTableService } from "../../../service/TraceTableService";
import { useUnloadWarning } from "../../../hooks/useUnloadWarning";

export default function NewExercise() {
    const { setTraceData, exerciseDraft, setExerciseDraft, clearExerciseDraft } = useContext(TraceTableContext);

    const [file, setFile] = useState(exerciseDraft?.file || null);
    const [exerciseName, setExerciseName] = useState(exerciseDraft?.exerciseName || "");
    const [qtdVariables, setVariables] = useState(exerciseDraft?.qtdVariables || "1");
    const [qtdRows, setQtdRows] = useState(exerciseDraft?.qtdRows || "1");
    const [selectedThemes, setSelectedThemes] = useState(exerciseDraft?.selectedThemes || []);
    const [showColsOptions, setShowColsOptions] = useState("both");
    const [isValid, setIsValid] = useState(false);
    const [openPopUp, setOpenPopUp] = useState(false);
    const [openHelpPopUp, setOpenHelpPopUp] = useState(false);
    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState("");
    const [allThemes, setAllThemes] = useState([]);
    const [traceTables, setTraceTables] = useState([]);
    const [programmingLanguage, setProgrammingLanguage] = useState("python");

    const navigate = useNavigate();

    useUnloadWarning(true);

    const themeService = new ThemeService();
    const traceService = new TraceTableService();

    useEffect(() => {
        const fetchThemes = async () => {
            const response = await themeService.findAllThemesByUser();
            if (response.success) {
                setAllThemes(response.data.content || []);
                setIsValid((response.data.content || []).length > 0);
            }
        };

        const fetchTraceTables = async () => {
            const userId = localStorage.getItem("userId");
            const response = await traceService.getAllByUser(userId || "");
            if (response.success) {
                setTraceTables(response.data.content || []);
            }
        };

        fetchThemes();
        fetchTraceTables();
    }, []);

    const saveDraftAndNavigate = (path) => {
        setExerciseDraft({
            file,
            exerciseName,
            qtdVariables,
            qtdRows,
            selectedThemes,
            showColsOptions,
            programmingLanguage
        });

        navigate(path);
    };

    function getLastTraceTable() {
        return traceTables.length > 0 ? traceTables[traceTables.length - 1] : null;
    }

    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            setFile(file);
        }
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (selectedThemes.length === 0) {
            setPopUpMessage("Selecione pelo menos um tema antes de prosseguir");
            setShowMessagePopUp(true);
            return;
        }

        let newId = 1;
        const lastTable = getLastTraceTable();
        if (lastTable) newId = lastTable.id + 1;

        const themesIds = selectedThemes.map(theme => theme.id);

        const showSteps = showColsOptions === "both" || showColsOptions === "steps";
        const showRowsCol = showColsOptions === "both" || showColsOptions === "rows";

        const qtdVariablesNumber = parseInt(qtdVariables);
        const qtdRowsNumber = parseInt(qtdRows);

        if (isNaN(qtdVariablesNumber) || isNaN(qtdRowsNumber)) {
            setPopUpMessage("Quantidade de variáveis e linhas devem ser números válidos");
            setShowMessagePopUp(true);
            return;
        }

        const newTable = {
            id: newId,
            exerciseName,
            qtdVariables: qtdVariablesNumber,
            qtdSteps: qtdRowsNumber,
            themesIds,
            showSteps,
            showRowsCol,
            programmingLanguage,
        };

        setTraceData({ ...newTable, image: file });

        saveDraftAndNavigate("/shownTable");
    }

    const shownPopUp = () => {
        setOpenPopUp(true);
    }

    const showHelpPopUp = () => {
        setOpenHelpPopUp(true);
    };

    const handleCancel = () => {
        clearExerciseDraft();
        navigate("/");
    }

    return (
        <div className="background">
            <div className="form-bg">
                <div className="content-with-help">
                    <h2>Cadastrar nova Trace Table</h2>
                    <BsQuestionCircleFill className="icon-question" onClick={showHelpPopUp} />
                </div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="img">Forneça a
                            imagem do código</label>
                        <input
                            className="form-input"
                            type="file"
                            name="img"
                            id="img"
                            required
                            onChange={handleFileChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="exercise-name">Nome do exercício</label>
                        <input
                            className="form-input"
                            type="text"
                            name="exercise-name"
                            id="exercise-name"
                            minLength="1"
                            maxLength="30"
                            required
                            value={exerciseName}
                            onChange={(e) => setExerciseName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="programmingLanguage">Linguagem de programação:</label>
                        <select
                            id="programmingLanguage"
                            name="programmingLanguage"
                            className="form-input"
                            value={programmingLanguage}
                            onChange={(e) => setProgrammingLanguage(e.target.value)}
                        >
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="quant-variables">Quantidade de
                            variáveis do código</label>
                        <input
                            className="form-input"
                            type="number"
                            name="quant-variables"
                            id="quant-variables"
                            min="1"
                            max="4"
                            required
                            value={qtdVariables}
                            onChange={(e) => setVariables(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="quant-steps">Quantidade de
                            linhas que a trace table vai ter</label>
                        <input
                            className="form-input"
                            type="number"
                            name="quant-steps"
                            id="quant-steps"
                            min="1"
                            max="10"
                            required
                            value={qtdRows}
                            onChange={(e) => setQtdRows(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="showColsOptions">Quais colunas extras exibir na tabela?</label>
                        <select
                            id="showColsOptions"
                            name="showColsOptions"
                            className="form-input"
                            value={showColsOptions}
                            onChange={(e) => setShowColsOptions(e.target.value)}
                        >
                            <option value="both">Mostrar passos e linhas</option>
                            <option value="steps">Mostrar apenas os passos</option>
                            <option value="rows">Mostrar apenas as linhas</option>
                        </select>
                    </div>
                    <div className={styles.selectionThemes}>
                        <div className={styles.optionsTheme}>
                            <MultiSelect
                                items={allThemes}
                                title={"Selecionar tema"}
                                typeItem={"temas"}
                                setSelectedItems={setSelectedThemes}
                                selectedItems={selectedThemes}
                            />
                            <div className={styles.btnNewThemeContainer}>
                                <button type="button" onClick={() => saveDraftAndNavigate("/new-theme")} className={styles.btnNewTheme}>Cadastrar novo tema</button>
                            </div>
                        </div>
                    </div>
                    <div className="btn-container">
                        <button
                            type="submit"
                            className="btn btn-next"
                            disabled={!isValid}
                        >Prosseguir</button>
                        <button type="button" onClick={shownPopUp} className="btn">Voltar</button>
                    </div>
                </form>
            </div>

            {openPopUp && (
                <AttentionPopUp
                    text="Tem certeza que deseja cancelar a operação? Seus dados não serão salvos!"
                    confirmAction={handleCancel}
                    cancelAction={() => setOpenPopUp(false)}
                />
            )}
            {openHelpPopUp && (
                <HelpPopUp
                    text="O professor deve fornecer a imagem do código que o aluno vai utilizar 
                    para preencher a trace table. Além disso, é necessário informar a quantidade 
                    de variáveis (máximo de 4) e a quantidade de passos (máximo de 10) que serão 
                    exibidos na tabela. Também é preciso que o professor defina o(s) tema(s) 
                    relacionado(s) ao exercício."
                    onClose={() => setOpenHelpPopUp(false)}
                />
            )}
            {showMessagePopUp && (
                <MessagePopUp
                    message={popUpMessage}
                    showPopUp={setShowMessagePopUp}
                />
            )}
        </div>
    )
}
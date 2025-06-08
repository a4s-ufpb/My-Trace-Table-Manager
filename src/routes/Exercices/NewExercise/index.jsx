import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TraceTableContext } from "../../../contexts/TraceTableContext";
import styles from "./styles.module.css";
import { BsQuestionCircleFill } from "react-icons/bs";
import AttentionPopUp from "../../../components/AttentionPopUp";
import useTraceTableCollection from "../../../hooks/useTraceTableCollection";
import HelpPopUp from "../../../components/HelpPopUp";
import useThemeCollection from "../../../hooks/useThemeCollection";
import MultiSelect from "../../../components/MultiSelect";
import MessagePopUp from "../../../components/MessagePopUp";

export default function NewExercise() {
    const [file, setFile] = useState(null);
    const [exerciseName, setExerciseName] = useState("");
    const [qtdVariables, setVariables] = useState(1);
    const [qtdRows, setQtdRows] = useState(1);
    const [selectedThemes, setSelectedThemes] = useState([]);
    const [showSteps, setShowSteps] = useState("yes");
    const [isValid, setIsValid] = useState(false);
    const [openPopUp, setOpenPopUp] = useState(false);
    const [openHelpPopUp, setOpenHelpPopUp] = useState(false);
    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const navigate = useNavigate();

    const { traceTables, getLastTraceTable } = useTraceTableCollection();
    const { setTraceData } = useContext(TraceTableContext);

    const { allThemes } = useThemeCollection();

    useEffect(() => {
        if (allThemes.length > 0) {
            setIsValid(true)
        }
    }, [allThemes]);

    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            setFile(file);
        }
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (selectedThemes.length === 0) {
            setShowMessagePopUp(true);
            return;
        }

        let newId;
        if (traceTables.length > 0) {
            const lastTable = getLastTraceTable();
            newId = lastTable ? lastTable.id + 1 : 1;
        } else {
            newId = 1;
        }

        const themesIds = selectedThemes.map(theme => theme.id);
        console.log("Id dos temas ", themesIds);

        const newTable = {
            id: newId || 1,
            image: file,
            exerciseName,
            qtdVariables,
            qtdSteps: qtdRows,
            themesIds,
            showSteps: showSteps === "yes",
        };

        setTraceData(newTable);

        navigate("/showntable");
    }

    const shownPopUp = () => {
        setOpenPopUp(true);
    }

    const showHelpPopUp = () => {
        setOpenHelpPopUp(true);
    };

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
                            min="1"
                            max="30"
                            required
                            value={exerciseName}
                            onChange={(e) => setExerciseName(e.target.value)}
                        />
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
                            onChange={(e) => setVariables(parseInt(e.target.value))}
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
                            onChange={(e) => setQtdRows(parseInt(e.target.value))}
                        />
                    </div>
                    <div>
                        <label htmlFor="mostrar-passos">Deseja mostrar os passos da execução?</label>
                        <select
                            id="mostrar-passos"
                            name="mostrar-passos"
                            className="form-input"
                            value={showSteps}
                            onChange={(e) => setShowSteps(e.target.value)}
                        >
                            <option value="yes">Sim</option>
                            <option value="no">Não, mostrar apenas as linhas</option>
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
                                <button type="button" onClick={() => navigate("/new-theme")} className={styles.btnNewTheme}>Cadastrar novo tema</button>
                            </div>
                        </div>
                    </div>
                    <div className="btn-container">
                        <button type="submit" className="btn btn-next" disabled={!isValid}>Prosseguir</button>
                        <button type="button" onClick={shownPopUp} className="btn">Voltar</button>
                    </div>
                </form>
            </div>

            {openPopUp && (
                <AttentionPopUp
                    text="Tem certeza que deseja cancelar a operação? Seus dados não serão salvos!"
                    confirmAction={() => navigate("/")}
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
                    message={"Selecione pelo menos um tema antes de prosseguir"}
                    showPopUp={setShowMessagePopUp}
                />
            )}
        </div>
    )
}
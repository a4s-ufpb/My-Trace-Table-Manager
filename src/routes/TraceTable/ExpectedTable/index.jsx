import { useContext, useEffect, useState } from "react"
import "../traceTable.css";
import { useNavigate } from "react-router-dom";
import { BsQuestionCircleFill } from "react-icons/bs";
import AttentionPopUp from "../../../components/AttentionPopUp";
import HelpPopUp from "../../../components/HelpPopUp";
import { TraceTableContext } from "../../../contexts/TraceTableContext";
import { TraceTableService } from "../../../service/TraceTableService";
import MessagePopUp from "../../../components/MessagePopUp";
import { useUnloadWarning } from "../../../hooks/useUnloadWarning";
import { getValidTypesForValue, normalizeTypeTableForAPI } from "../../../utils/typeGuesser";
import ImageModal from "../../../components/ImageModal";

export default function ExpectedTable() {
    const [expectedTableData, setExpectedTableData] = useState([]);
    const [typeTableData, setTypeTableData] = useState([]);
    const [tableInfo, setTableInfo] = useState(null);
    const [isValid, setIsValid] = useState(false)
    const [openPopUpCancel, setOpenPopUpCancel] = useState(false);
    const [openPopUpEdit, setOpenPopUpEdit] = useState(false);
    const [openHelpPopUp, setOpenHelpPopUp] = useState(false);
    const [showValueType, setShowValueType] = useState(false);
    const [helpText, setHelpText] = useState("");

    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState("");

    const [imageURL, setImageURL] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useUnloadWarning(true);

    const navigate = useNavigate();

    const { traceData } = useContext(TraceTableContext);
    const traceService = new TraceTableService();
    const defaultString = traceData.programmingLanguage === 'java' ? 'String' : 'str';

    useEffect(() => {
        setExpectedTableData(traceData.shownTable || []);
        setTableInfo(traceData);

        const linhaIndex = (traceData.headerTable || []).findIndex(h => h.toLowerCase().includes('linha'));
        const linhaDataIndex = traceData.showSteps ? linhaIndex - 1 : linhaIndex;

        const isInteger = /^-?\d+$/;

        const initializedTypeTable = (traceData.shownTable || []).map(row =>
            row.map((cell, colIndex) => {
                if (cell === "#") return "#";

                if (colIndex === linhaDataIndex && isInteger.test(cell)) {
                    return 'int';
                }

                return defaultString;
            })
        );

        setTypeTableData(initializedTypeTable);
    }, [traceData]);

    useEffect(() => {
        const allFilled = expectedTableData.every(row =>
            row.every(cell => cell.trim() !== '' && cell !== '?')
        );

        setIsValid(allFilled)
    }, [expectedTableData]);

    useEffect(() => {
        if (traceData.image) {
            const url = URL.createObjectURL(traceData.image);
            setImageURL(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [traceData.image]);

    const handleInputChange = (row, col, value) => {
        setExpectedTableData(prevData => {
            const newTableData = prevData.map((r, i) =>
                i === row ? r.map((c, j) => (j === col ? value : c)) : r
            );
            return newTableData;
        });
        setTypeTableData(prevData => {
            const newTableData = prevData.map((r, i) =>
                i === row ? r.map((c, j) => (j === col ? defaultString : c)) : r
            );
            return newTableData;
        });
    };

    const handleSelectChange = (row, col, value) => {
        setTypeTableData(prevData => {
            const newTableData = prevData.map((r, i) =>
                i === row ? r.map((c, j) => (j === col ? value : c)) : r
            );
            return newTableData;
        });
    };


    const saveTableData = async () => {
        const normalizedTypeTable = normalizeTypeTableForAPI(typeTableData);

        const newTable = {
            exerciseName: traceData.exerciseName,
            header: traceData.headerTable,
            shownTraceTable: traceData.shownTable,
            expectedTraceTable: expectedTableData,
            typeTable: normalizedTypeTable,
            programmingLanguage: traceData.programmingLanguage
        };

        const response = await traceService.addTraceTable(
            newTable,
            traceData.image,
            traceData.themesIds
        );

        if (response.success) {
            setPopUpMessage("Exercício salvo com sucesso!");
            setShowMessagePopUp(true);
            setTimeout(() => {
                navigate("/");
            }, 1200);
        } else {
            setPopUpMessage(response.message || "Erro ao salvar exercício");
            setShowMessagePopUp(true);
        }
    };

    const shownPopUpCancel = () => setOpenPopUpCancel(true);

    const shownPopUpEdit = () => setOpenPopUpEdit(true);

    const cancelOperation = () => navigate("/");

    const handleImageClick = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const showHelpPopUp = (text) => {
        setHelpText(text);
        setOpenHelpPopUp(true);
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
            <div className="wrapper">
                {imageURL && (
                    <div className="img-container">
                        <img
                            src={imageURL}
                            alt="Código do exercício"
                            onClick={handleImageClick}
                        />
                    </div>
                )}
                <div className="trace-container">
                    <div className="title-container">
                        <div className="content-with-help">
                            <h2>Tabela Esperada</h2>
                            <BsQuestionCircleFill className="icon-question" onClick={() => showHelpPopUp("O professor deve preencher a tabela com os valores esperados para a resposta do aluno. Essa tabela servirá como referência para a correção, comparando as respostas fornecidas com os resultados esperados.")} />
                        </div>
                        <span className="table-subtitle">Preencha as respostas esperadas para essa Trace Table</span>
                    </div>
                    <div>
                        {tableInfo && (
                            <table>
                                <thead>
                                    <tr>
                                        {tableInfo?.headerTable?.map((variable, variableIndex) => (
                                            <th key={variableIndex} className={getColumnClasses(variable)}>{variable}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {expectedTableData?.map((row, i) => (
                                        <tr key={i}>
                                            {traceData.showSteps &&
                                                <td className={`step-cell ${getColumnClasses('Passo')}`}>{i + 1}º</td>
                                            }
                                            {row.map((cell, j) => {
                                                const columnName = tableInfo?.headerTable[j + (traceData.showSteps ? 1 : 0)];
                                                const isDisabled = cell === "#";

                                                const cellClasses = [
                                                    getColumnClasses(columnName),
                                                    isDisabled ? 'disabled-cell' : ''
                                                ].join(' ').trim();

                                                return (
                                                    <td key={j} className={cellClasses}>
                                                        {(traceData.shownTable[i][j] === "?") ? (
                                                            <input
                                                                type="text"
                                                                value={cell === "?" ? "" : cell}
                                                                maxLength={10}
                                                                onChange={(e) => handleInputChange(i, j, e.target.value)}
                                                            />
                                                        ) : cell === "#" ? "" : cell}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                <div>
                    <div className="content-with-help">
                        <label htmlFor="showValueType" className="checkbox-label">
                            <input
                                type="checkbox"
                                name="showValueType"
                                id="showValueType"
                                checked={showValueType}
                                onChange={() => setShowValueType(!showValueType)}
                            />
                            Preencher tabela com o tipo do valor de cada célula
                            <BsQuestionCircleFill className="icon-question" onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                showHelpPopUp("O professor pode preencher a tabela de tipos com o respectivo tipo de valor esperado em cada célula. Caso opte em não preencher a tabela de tipos, todas as células serão consideradas 'String' por padrão. A tipagem é interessante para a correção, pois permite que o sistema verifique se o tipo de dado enviado pelo aluno corresponde ao esperado, fornecendo um feedback mais preciso.")
                            }} />
                        </label>
                    </div>
                </div>
                {tableInfo && showValueType && (
                    <div className="trace-container">
                        <div className="title-container">
                            <h2>Tabela de Tipos</h2>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    {tableInfo?.headerTable?.map((variable, variableIndex) => (
                                        <th key={variableIndex} className={getColumnClasses(variable)}>{variable}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {typeTableData?.map((row, i) => (
                                    <tr key={i}>
                                        {traceData.showSteps &&
                                            <td className={`step-cell ${getColumnClasses('Passo')}`}>{i + 1}º</td>
                                        }
                                        {row.map((cell, j) => {
                                            const columnName = tableInfo?.headerTable[j + (traceData.showSteps ? 1 : 0)];
                                            const isDisabled = cell === "#";

                                            const cellClasses = [
                                                getColumnClasses(columnName),
                                                isDisabled ? 'disabled-cell' : ''
                                            ].join(' ').trim();

                                            return (
                                                <td key={j} className={cellClasses}>
                                                    {traceData.shownTable[i][j] === "?" ? (
                                                        <select
                                                            name="valueType"
                                                            id="valueType"
                                                            value={cell === "?" ? "" : cell}
                                                            onChange={(e) => handleSelectChange(i, j, e.target.value)}
                                                        >
                                                            {getValidTypesForValue(expectedTableData[i][j], tableInfo.programmingLanguage)
                                                                .map((type, index) => (
                                                                    <option key={index} value={type}>
                                                                        {type}
                                                                    </option>
                                                                ))}
                                                        </select>
                                                    ) : cell === "#" ? "" : cell}
                                                </td>
                                            )

                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="btn-container">
                <button onClick={saveTableData} disabled={!isValid} className="btn btn-next">Salvar</button>
                <button onClick={shownPopUpEdit} className="btn">Editar</button>
                <button onClick={shownPopUpCancel} className="btn">Cancelar</button>
            </div>
            {openPopUpCancel && (
                <AttentionPopUp
                    text="Tem certeza que deseja cancelar a operação? Seus dados não serão salvos!"
                    confirmAction={cancelOperation}
                    cancelAction={() => setOpenPopUpCancel(false)}
                />
            )}
            {openPopUpEdit && (
                <AttentionPopUp
                    text="Tem certeza que deseja voltar para a tela anterior? Seus dados da tela atual não serão salvos!"
                    confirmAction={() => navigate("/showntable")}
                    cancelAction={() => setOpenPopUpEdit(false)}
                />
            )}
            {openHelpPopUp && (
                <HelpPopUp
                    text={helpText}
                    onClose={() => setOpenHelpPopUp(false)}
                />
            )}
            {showMessagePopUp && (
                <MessagePopUp
                    message={popUpMessage}
                    showPopUp={setShowMessagePopUp}
                />
            )}
            <ImageModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                imageSrc={imageURL}
            />
        </div>
    )
}
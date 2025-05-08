import { useContext, useEffect, useState } from "react"
import "../traceTable.css";
import { useNavigate } from "react-router-dom";
import { BsQuestionCircleFill } from "react-icons/bs";
import AttentionPopUp from "../../../components/AttentionPopUp";
import useTraceTableCollection from "../../../hooks/useTraceTableCollection";
import HelpPopUp from "../../../components/HelpPopUp";
import { TraceTableContext } from "../../../contexts/TraceTableContext";

export default function ExpectedTable() {
    const [expectedTableData, setExpectedTableData] = useState([]);
    const [typeTableData, setTypeTableData] = useState([]);
    const [tableInfo, setTableInfo] = useState(null);
    const [isValid, setIsValid] = useState(false)
    const [openPopUpCancel, setOpenPopUpCancel] = useState(false);
    const [openPopUpEdit, setOpenPopUpEdit] = useState(false);
    const [openHelpPopUp, setOpenHelpPopUp] = useState(false);
    const [showValueType, setShowValueType] = useState(false);

    const { addTraceTable } = useTraceTableCollection();
    const { traceData } = useContext(TraceTableContext);


    const navigate = useNavigate();

    useEffect(() => {
        setExpectedTableData(traceData.shownTable || []);
        setTableInfo(traceData);
        const initializedTypeTable = (traceData.shownTable || []).map(row =>
            row.map(cell => cell !== "#" ? "String" : cell)
        );
        setTypeTableData(initializedTypeTable);
    }, [traceData.shownTable]);

    useEffect(() => {
        const allFilled = expectedTableData.every(row => row.every(cell => cell.trim() !== '' && cell !== '?'));
        setIsValid(allFilled)
    }, [expectedTableData])

    const handleInputChange = (row, col, value) => {
        setExpectedTableData(prevData => {
            const newTableData = prevData.map((r, i) =>
                i === row ? r.map((c, j) => (j === col ? value : c)) : r
            );
            return newTableData;
        });

        console.log('Matriz expected:', expectedTableData);
    };

    const handleSelectChange = (row, col, value) => {
        setTypeTableData(prevData => {
            const newTableData = prevData.map((r, i) =>
                i === row ? r.map((c, j) => (j === col ? value : c)) : r
            );
            return newTableData;
        });

        console.log('Matriz type:', typeTableData);
    };


    const saveTableData = () => {
        const newTable = {
            exerciseName: traceData.exerciseName,
            header: traceData.headerTable,
            shownTraceTable: traceData.shownTable,
            expectedTraceTable: expectedTableData,
            typeTable: typeTableData,
        };

        console.log("(ET) Trace Table Request:", newTable);
        console.log("(ET) Theme ID:", traceData.themeId);
        console.log("(ET) Image:", traceData.image);
        addTraceTable(newTable, traceData.image, traceData.themesIds);
        navigate("/");
    }

    const shownPopUpCancel = () => {
        setOpenPopUpCancel(true);
    }

    const shownPopUpEdit = () => {
        setOpenPopUpEdit(true);
    }

    const showHelpPopUp = () => {
        setOpenHelpPopUp(true);
    };

    const cancelOperation = () => {
        navigate("/");
    }

    return (
        <div className="background">
            <div className="title-container">
                <h3 className="table-title">Tabela Esperada</h3>
                <span className="table-subtitle">Preencha as respostas esperadas para essa Trace Table</span>
            </div>
            <div>
                {tableInfo && (
                    <div className="content-with-help">
                        <table border={1}>
                            <thead>
                                <tr>
                                    {tableInfo?.headerTable?.map((variable, variableIndex) => (
                                        <th key={variableIndex}>{variable}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {expectedTableData?.map((row, i) => (
                                    <tr key={i}>
                                        {traceData.showSteps &&
                                            <td className="step-cell">{i + 1}º</td>
                                        }
                                        {row.map((cell, j) => (
                                            <td key={j} className={cell === "#" ? "disabled-cell" : ""}>
                                                {cell !== "#" ? (
                                                    <input
                                                        type="text"
                                                        value={cell === "?" ? "" : cell}
                                                        maxLength={10}
                                                        onChange={(e) => handleInputChange(i, j, e.target.value)}
                                                    />
                                                ) : ""}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <BsQuestionCircleFill className="icon-question" onClick={showHelpPopUp} />
                    </div>
                )}
            </div>
            <div>
                <label htmlFor="showValueType">
                    <input 
                        type="checkbox" 
                        name="showValueType" 
                        id="showValueType" 
                        checked={showValueType}
                        onChange={() => setShowValueType(!showValueType)}
                    />
                    Preencher tabela com o tipo do valor de cada célula
                </label>
            </div>
            <div>
                {tableInfo && showValueType &&(
                    <div className="content-with-help">
                        <table border={1}>
                            <thead>
                                <tr>
                                    {tableInfo?.headerTable?.map((variable, variableIndex) => (
                                        <th key={variableIndex}>{variable}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {typeTableData?.map((row, i) => (
                                    <tr key={i}>
                                        {traceData.showSteps &&
                                            <td className="step-cell">{i + 1}º</td>
                                        }
                                        {row.map((cell, j) => (
                                            <td key={j} className={cell === "#" ? "disabled-cell" : ""}>
                                                {cell !== "#" ? (
                                                    <select 
                                                        name="valueType" 
                                                        id="valueType"
                                                        value={cell === "?" ? "" : cell}
                                                        onChange={(e) => handleSelectChange(i, j, e.target.value)}
                                                    >
                                                        <option value="String">String</option>
                                                        <option value="int">int</option>
                                                        <option value="double">double</option>
                                                        <option value="float">float</option>
                                                        <option value="boolean">boolean</option>
                                                    </select>
                                                ) : ""}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <BsQuestionCircleFill className="icon-question" onClick={showHelpPopUp} />
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
                    text="O professor deve preencher a tabela com os valores esperados para a resposta do aluno. 
                    Essa tabela servirá como referência para a correção, comparando as respostas 
                    fornecidas com os resultados esperados."
                    onClose={() => setOpenHelpPopUp(false)}
                />
            )}
        </div>
    )
}
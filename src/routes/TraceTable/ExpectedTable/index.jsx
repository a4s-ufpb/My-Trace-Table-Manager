import { useEffect, useState } from "react"
import "../traceTable.css";
import { useNavigate } from "react-router-dom";
import { BsQuestionCircleFill } from "react-icons/bs";
import AttentionPopUp from "../../../components/AttentionPopUp";
import useTraceTableCollection from "../../../hooks/useTraceTableCollection";
import HelpPopUp from "../../../components/HelpPopUp";

export default function ExpectedTable() {
    const [expectedTableData, setExpectedTableData] = useState([]);
    const [tableInfo, setTableInfo] = useState(null);
    const [isValid, setIsValid] = useState(false)
    const [openPopUpCancel, setOpenPopUpCancel] = useState(false);
    const [openPopUpEdit, setOpenPopUpEdit] = useState(false);
    const [openHelpPopUp, setOpenHelpPopUp] = useState(false);

    const { traceTables, addTraceTable, getLastTraceTable } = useTraceTableCollection();

    const navigate = useNavigate();

    useEffect(() => {
        if (traceTables.length > 0) {
            const lastTable = getLastTraceTable();
            console.log("Última tabela recuperada:", lastTable);
            setExpectedTableData(lastTable.shownTable || []);
            setTableInfo(lastTable);
        }
    }, []);

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

    const saveExpectedTable = () => {
        if (traceTables.length > 0) {

            const updatedTable = {
                ...tableInfo,
                expectedTable: expectedTableData
            };

            addTraceTable(updatedTable);

            navigate("/");
        }
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
        if (traceTables.length > 0) {
            const updatedTables = traceTables.filter(t => t.id !== tableInfo.id);

            localStorage.setItem("traceTables", JSON.stringify(updatedTables));
            console.log("Tabelas após cancelar:", updatedTables);

            navigate("/");
        }
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
                                    {tableInfo?.header?.map((variable, variableIndex) => (
                                        <th key={variableIndex}>{variable}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {expectedTableData?.map((row, i) => (
                                    <tr key={i}>
                                        {tableInfo.showSteps &&
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
            <div className="btn-container">
                <button onClick={saveExpectedTable} disabled={!isValid} className="btn btn-next">Salvar</button>
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
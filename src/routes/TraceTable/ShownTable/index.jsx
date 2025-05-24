import { useContext, useEffect, useState } from "react";
import { TraceTableContext } from "../../../contexts/TraceTableContext";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import "../traceTable.css";
import { BsQuestionCircleFill } from "react-icons/bs";
import AttentionPopUp from "../../../components/AttentionPopUp";
import useTraceTableCollection from "../../../hooks/useTraceTableCollection";
import HelpPopUp from "../../../components/HelpPopUp";

export default function ShownTable() {

    const navigate = useNavigate();
    const [openPopUp, setOpenPopUp] = useState(false);
    const [openHelpPopUp, setOpenHelpPopUp] = useState(false);
    const [imageURL, setImageURL] = useState(null);

    const { traceData, setTraceData } = useContext(TraceTableContext);
    const { getLastTraceTable } = useTraceTableCollection();

    const [headerTable, setHeaderTable] = useState(traceData.showSteps ?
        ["Passo", "Linha", ...Array(traceData.qtdVariables).fill('')]
        : ["Linha", ...Array(traceData.qtdVariables).fill('')]
    );

    const [shownTableData, setShownTableData] = useState(
        Array(traceData.qtdSteps).fill().map(() => Array(traceData.qtdVariables + 1).fill(''))
    );

    const [isValid, setIsValid] = useState(false)

    useEffect(() => {
        if (Array.isArray(traceData.shownTable) && traceData.shownTable.length > 0) {
            setShownTableData(traceData.shownTable);
            setHeaderTable(traceData.headerTable);
        }
    }, []);

    useEffect(() => {
        if (traceData.image) {
            const url = URL.createObjectURL(traceData.image);
            setImageURL(url);
    
            return () => URL.revokeObjectURL(url);
        }
    }, [traceData.image]);

    useEffect(() => {
        const allFilled = shownTableData.every(row => row.every(cell => cell.trim() !== ''));
        setIsValid(allFilled)
    }, [shownTableData])

    useEffect(() => {
        const lastTable = getLastTraceTable();
        if (lastTable && lastTable.id === traceData.id) {
            setHeaderTable(lastTable.header);
            setShownTableData(lastTable.shownTable);
        }
    }, [traceData.id]);

    const shownPopUp = () => {
        setOpenPopUp(true);
    }

    const showHelpPopUp = () => {
        setOpenHelpPopUp(true);
    };

    const cancelOperation = () => {
        navigate("/");
    }

    const handleInputChange = (row, col, value) => {
        setShownTableData(prevData => {
            const newTableData = prevData.map((r, i) =>
                i === row ? r.map((c, j) => (j === col ? value : c)) : r
            );
            return newTableData;
        });
    };

    const handleHeaderChange = (col, value) => {
        setHeaderTable(prevHeader => {
            const newHeader = [...prevHeader];
            newHeader[col] = value;
            return newHeader;
        });
    }

    const inputStartIndex = traceData.showSteps ? 1 : 0;

    return (
        <div className="background">
            <div className={styles.traceTableContainer}>
                <div>
                    {imageURL && (
                        <div className="img-container">
                            <img src={imageURL} alt="Código do exercício" />
                        </div>
                    )}
                </div>
                <div>
                    <div className={styles.traceTable}>
                        <div className="title-container">
                            <h3 className="table-title">Tabela Mostrada</h3>
                            <span className="table-subtitle">Configure a tabela a ser mostrada no exercício</span>
                        </div>
                        <div className="content-with-help">
                            <table>
                                <thead>
                                    <tr>
                                        {headerTable.map((header, i) => (
                                            <th key={i}>
                                                {i > inputStartIndex ? (
                                                    <input
                                                        type="text"
                                                        value={header}
                                                        onChange={(e) => handleHeaderChange(i, e.target.value)}
                                                        maxLength={8}
                                                        placeholder={`Var ${i - inputStartIndex}`}
                                                    />
                                                ) : (
                                                    header
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {shownTableData.map((row, i) => (
                                        <tr key={i}>
                                            {traceData.showSteps &&
                                                <td className="step-cell">{i + 1}º</td>
                                            }
                                            {row.map((cell, j) => (
                                                <td key={j}>
                                                    <input
                                                        type="text"
                                                        value={cell}
                                                        maxLength={10}
                                                        onChange={(e) => handleInputChange(i, j, e.target.value)}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <BsQuestionCircleFill className="icon-question" onClick={showHelpPopUp} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="btn-container">
                <button
                    className="btn btn-next"
                    onClick={() => {
                        setTraceData({
                            ...traceData,
                            shownTable: shownTableData,
                            headerTable: headerTable,
                        });
                        navigate("/expectedtable")
                    }
                    }
                    disabled={!isValid}
                >Prosseguir</button>
                <button onClick={shownPopUp} className="btn">Cancelar</button>
            </div>
            {openPopUp && (
                <AttentionPopUp
                    text="Tem certeza que deseja cancelar a operação? Seus dados não serão salvos!"
                    confirmAction={cancelOperation}
                    cancelAction={() => setOpenPopUp(false)}
                />
            )}
            {openHelpPopUp && (
                <HelpPopUp
                    text="O professor deve marcar as células que o aluno pode editar com '?'. 
                    As células que não podem ser alteradas devem ser preenchidas com '#'. Se quiser, também pode
                    já deixar valores preenchidos nas células."
                    onClose={() => setOpenHelpPopUp(false)}
                />
            )}
        </div>
    );
}

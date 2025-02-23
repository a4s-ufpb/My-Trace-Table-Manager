import { useContext, useEffect, useState } from "react";
import { TraceTableContext } from "../../../contexts/TraceTableContext";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import "../traceTable.css";

export default function ShownTable() {

    const navigate = useNavigate();

    const { traceData } = useContext(TraceTableContext);

    const [headerTable, setHeaderTable] = useState(["Passo", "Linha", ...Array(traceData.qtdVariables).fill('')])

    const [shownTableData, setShownTableData] = useState(
        Array(traceData.qtdSteps).fill().map(() => Array(traceData.qtdVariables + 1).fill(''))
    );

    const [isValid, setIsValid] = useState(false)

    useEffect(() => {
        const allFilled = shownTableData.every(row => row.every(cell => cell.trim() !== ''));
        setIsValid(allFilled)
    }, [shownTableData])

    useEffect(() => {
        const savedTables = JSON.parse(localStorage.getItem('traceTables')) || [];
        
        // Procurar a tabela com o mesmo ID do exercício atual
        const existingTable = savedTables.find(t => t.id === traceData.id);
        if (existingTable) {
            setHeaderTable(existingTable.header);
            setShownTableData(existingTable.shownTable);
        }

    }, [traceData.id]);

    const saveTableData = () => {
        const savedTables = JSON.parse(localStorage.getItem('traceTables')) || [];

        const newTraceTable = {
            id: traceData.id,
            qtdSteps: traceData.qtdSteps,
            qtdVariables: traceData.qtdVariables,
            themes: traceData.themes,
            img: traceData.file,
            header: headerTable,
            shownTable: shownTableData,
            expectedTable: []
        }

        const updatedTables = savedTables.filter(t => t.id !== newTraceTable.id);
        updatedTables.push(newTraceTable);

        localStorage.setItem('traceTables', JSON.stringify(updatedTables));
        console.log("visualizar: ", newTraceTable)
    }

    const cancelOperation = () => {
        const savedTables = JSON.parse(localStorage.getItem('traceTables')) || [];
        if (savedTables.length > 0) {
            const lastTable = savedTables[savedTables.length - 1];

            const updatedTables = savedTables.filter(t => t.id !== lastTable.id);

            localStorage.setItem("traceTables", JSON.stringify(updatedTables));
            console.log("Tabelas após cancelar:", updatedTables);
        }
        navigate("/");
    }

    const handleInputChange = (row, col, value) => {
        console.log("variaveis:", traceData.qtdVariables)
        console.log("passos:", traceData.qtdSteps)
        setShownTableData(prevData => {
            const newTableData = prevData.map((r, i) =>
                i === row ? r.map((c, j) => (j === col ? value : c)) : r
            );
            return newTableData;
        });
        console.log('Header:', headerTable)
        console.log('Matriz tableData:', shownTableData);
    };

    const handleHeaderChange = (col, value) => {
        setHeaderTable(prevHeader => {
            const newHeader = [...prevHeader];
            newHeader[col] = value;
            return newHeader;
        });
    }

    return (
        <div className="background">
            <div className={styles.traceTableContainer}>
                <div>
                    {traceData.file && (
                        <div className={styles.imgContainer}>
                            <img src={URL.createObjectURL(traceData.file)} alt="Código do exercício"/>
                        </div>
                    )}
                </div>
                <div>
                    <div className={styles.traceTable}>
                        <table>
                            <thead>
                                <tr>
                                    {headerTable.map((header, i) => (
                                        <th key={i}>
                                            {i > 1 ? (
                                                <input
                                                    type="text"
                                                    value={header}
                                                    onChange={(e) => handleHeaderChange(i, e.target.value)}
                                                    maxLength={8}
                                                    placeholder={`Var ${i - 1}`}
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
                                        <td>{i + 1}º</td>
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
                    </div>

                </div>
            </div>
            <div className="btn-container">
                <button
                    className="btn-next"
                    onClick={() => {
                        saveTableData();
                        navigate("/expectedtable");
                    }}
                    disabled={!isValid}
                >Prosseguir</button>
                <button onClick={cancelOperation} className="btn-cancel">Cancelar</button>
            </div>
        </div>
    );
}

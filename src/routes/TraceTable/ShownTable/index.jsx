import { useContext, useEffect, useState } from "react";
import { TraceTableContext } from "../../../contexts/TraceTableContext";
import { useNavigate } from "react-router-dom";

export default function ShownTable() {

    const navigate = useNavigate()

    const { traceData } = useContext(TraceTableContext);

    const [headerTable, setHeaderTable] = useState(["Passo", "Linha", ...Array(traceData.qtdVariables).fill('Variável')])

    const [shownTableData, setShownTableData] = useState(
        Array(traceData.qtdSteps).fill().map(() => Array(traceData.qtdVariables + 1).fill(''))
    );

    const [isValid, setIsValid] = useState(false)

    useEffect(() => {
        const allFilled = shownTableData.every(row => row.every(cell => cell.trim() !== ''));
        setIsValid(allFilled)
    }, [shownTableData])

    const saveTableData = () => {
        const savedTables = JSON.parse(localStorage.getItem('traceTables')) || [];
        
        const newTraceTable = {
            id: traceData.id,
            qtdSteps: traceData.qtdSteps,
            qtdVariables: traceData.qtdVariables,
            img: traceData.file,
            header: headerTable,
            shownTable: shownTableData,
            expectedTable: []
        }

        const updatedTables = savedTables.filter(t => t.id !== newTraceTable.id);
        updatedTables.push(newTraceTable);

        localStorage.setItem('traceTables', JSON.stringify(updatedTables));
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
        <div className="background background-trace">
            <p className="stage">Etapa 2/3</p>
            <div className="trace-table-container" style={{ display: "flex", justifyContent: "center", gap: "2rem"}}>
                <div>
                    {traceData.file && (
                        <div>
                            <h3>Imagem do código:</h3>
                            <img src={URL.createObjectURL(traceData.file)} alt="Código do exercício" width="300px" height="200px" />
                        </div>
                    )}
                </div>
                <div>
                    <h3>Trace Table mostrada:</h3>
                    <div className="trace-table">
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
            <button
                onClick={() => {
                    saveTableData();
                    navigate("/expectedtable");
                }} 
                disabled={!isValid}
            >Prosseguir</button>
        </div>
    );
}

import { useEffect, useState } from "react"
import DisplaySavedTable from "../../../components/DisplaySavedTable"

export default function ExpectedTable() {
    const [expectedTableData, setExpectedTableData] = useState([]);
    const [tableInfo, setTableInfo] = useState(null);
    const [isValid, setIsValid] = useState(false)

    useEffect(() => {
        const savedTables = JSON.parse(localStorage.getItem('traceTables')) || [];
        if (savedTables.length > 0) {
            const lastTable = savedTables[savedTables.length - 1];
            setExpectedTableData(lastTable.shownTable);
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
        if (tableInfo) {
            const savedTables = JSON.parse(localStorage.getItem('traceTables')) || [];

            const updatedTables = savedTables.map(t => 
                t.id === tableInfo.id ? { ...t, expectedTable: expectedTableData } : t
            );

            localStorage.setItem("traceTables", JSON.stringify(updatedTables));

            console.log("Tabelas após salvar:", updatedTables);
        }
    }

    return(
        <div className="background">
            <p className="stage">Etapa 3/3</p>
            {tableInfo && <DisplaySavedTable traceTable={tableInfo} typeTable={tableInfo.shownTable} />}
            <h3>Expected Table</h3>
            {tableInfo && (
                <>
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Passo</th>
                                <th>Linha</th>
                                {expectedTableData[0].map((variable, variableIndex) => (
                                    <th key={variableIndex}>{variable || `Var ${variableIndex + 1}`}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {expectedTableData.slice(1).map((row, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{tableInfo.initialLine + i}</td>
                                    {row.map((cell, j) => (
                                        <td key={j}>
                                            {cell !== "#" ? (
                                                <input
                                                type="text"
                                                value={cell === "?" ? "" : cell}
                                                onChange={(e) => handleInputChange(i + 1, j, e.target.value)}
                                                />
                                            ): ""}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={saveExpectedTable} disabled={!isValid}>Salvar</button>
                </>
            )}
        </div>
    )
}
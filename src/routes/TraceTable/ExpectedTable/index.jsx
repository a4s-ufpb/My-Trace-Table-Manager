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
            {tableInfo && <DisplaySavedTable tableInfo={tableInfo} typeTable={tableInfo.shownTable} />}
            <h3>Expected Table</h3>
            {tableInfo && (
                <>
                    <table border={1}>
                        <thead>
                            <tr>
                                {tableInfo.header.map((variable, variableIndex) => (
                                    <th key={variableIndex}>{variable}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {expectedTableData.map((row, i) => (
                                <tr key={i}>
                                    <td>{i + 1}º</td>
                                    {row.map((cell, j) => (
                                        <td key={j}>
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
                    <button onClick={saveExpectedTable} disabled={!isValid}>Salvar</button>
                </>
            )}
        </div>
    )
}
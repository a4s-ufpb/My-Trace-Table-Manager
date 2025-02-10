import { useEffect, useState } from "react";

export default function DisplaySavedTable() {
    const [lastTable, setLastTable] = useState(null);

    useEffect(() => {
        const tables = JSON.parse(localStorage.getItem("traceTables")) || [];
        if (tables.length > 0) {
            setLastTable(tables[tables.length - 1]); // Pegando a última tabela salva
        }
    }, []);

    return (
        <div>
            <h3>Shown Table:</h3>
            {lastTable ? (
                <div>
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Passo</th>
                                <th>Linha</th>
                                {lastTable.shownTable[0].map((variable, variableIndex) => (
                                    <th key={variableIndex}>{variable || `Var ${variableIndex + 1}`}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {lastTable.shownTable.slice(1).map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td>{rowIndex + 1}</td>
                                    <td>{lastTable.initialLine + rowIndex}</td> 
                                    {row.map((cell, colIndex) => (
                                        <td key={colIndex}>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>Nenhuma tabela salva.</p>
            )}
        </div>
    );
}

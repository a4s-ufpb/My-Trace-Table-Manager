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
            <h3>Última Trace Table Salva:</h3>
            {lastTable ? (
                <div>
                    <p><strong>Tema:</strong> {lastTable.tema}</p>
                    <p><strong>ID:</strong> {lastTable.id}</p>
                    <p><strong>Passos:</strong> {lastTable.steps} | <strong>Variáveis:</strong> {lastTable.variables} | <strong>Linha Inicial:</strong> {lastTable.initialLine}</p>

                    <table border="1">
                        <thead>
                            <tr>
                                <th>Passo</th>
                                <th>Linha</th>
                                {lastTable.tableData[0].map((variable, variableIndex) => (
                                    <th key={variableIndex}>{variable || `Var ${variableIndex + 1}`}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {lastTable.tableData.slice(1).map((row, rowIndex) => (
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

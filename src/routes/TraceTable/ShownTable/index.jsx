import { useContext, useState } from "react";
import { TraceTableContext } from "../../../contexts/TraceTableContext";
import { useNavigate } from "react-router-dom";

export default function ShownTable() {

    const navigate = useNavigate()

    const { traceData } = useContext(TraceTableContext);

    const [tableData, setTableData] = useState(
        Array.from({ length: traceData.steps + 1 }, () => Array(traceData.variables).fill(''))
    );

    const saveTableData = (newTableData) => {
        const savedTables = JSON.parse(localStorage.getItem('traceTables')) || [];
        
        const newTraceTable = {
            id: traceData.id, // ID único da trace table
            theme: traceData.theme, // Tema escolhido
            initialLine: traceData.initialLine, // Linha inicial
            steps: traceData.steps, // Número de passos
            variables: traceData.variables, // Número de variáveis
            tableData: newTableData, // Matriz da tabela
        }

        const updatedTables = savedTables.filter(t => t.id !== newTraceTable.id);
        updatedTables.push(newTraceTable);

        localStorage.setItem('traceTables', JSON.stringify(updatedTables));
    }

    const handleInputChange = (row, col, value) => {
        const newTableData = [...tableData];
        newTableData[row][col] = value;
        setTableData(newTableData);
        saveTableData(newTableData);
        console.log('Matriz tableData:', tableData);
    };

    return (
        <div className="background">
             <p className="stage">Etapa 2/3</p>
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
                <table border="1">
                    <thead>
                        <tr>
                            <th>Passo</th>
                            <th>Linha</th>
                            {Array.from({ length: traceData.variables }, (_, j) => (
                                <th key={j}>
                                    <input
                                        type="text"
                                        value={tableData[0][j] || ''}
                                        onChange={(e) => handleInputChange(0, j, e.target.value)}
                                    />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: traceData.steps }, (_, i) => (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{traceData.initialLine + i}</td>
                                {Array.from({ length: traceData.variables }, (_, j) => (
                                    <td key={j}>
                                        <input
                                            type="text"
                                            value={tableData[i + 1][j] || ''}
                                            onChange={(e) => handleInputChange(i + 1, j, e.target.value)}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={() => navigate("/expectedtable")}>Prosseguir</button>
        </div>
    );
}

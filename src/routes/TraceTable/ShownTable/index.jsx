import { useContext, useState } from "react";
import { TraceTableContext } from "../../../contexts/TraceTableContext";

export default function ShownTable() {

    const { traceData } = useContext(TraceTableContext);

    const [tableData, setTableData] = useState(
        Array.from({ length: traceData.steps + 1 }, () => Array(traceData.variables).fill(''))
    );

    const handleInputChange = (row, col, value) => {
        const newTableData = [...tableData];
        newTableData[row][col] = value;
        setTableData(newTableData);
        console.log('Matriz tableData:', tableData);
    };

    return (
        <div className="background">
            <div>
                {traceData.file && (
                    <div>
                        <h3>Imagem do código:</h3>
                        <img src={URL.createObjectURL(traceData.file)} alt="Código do exercício" width="300px" height="200px" />
                    </div>
                )}
            </div>
            <div>
                <h3>Trace Table</h3>
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
        </div>
    );
}

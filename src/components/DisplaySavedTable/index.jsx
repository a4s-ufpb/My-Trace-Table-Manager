export default function DisplaySavedTable({ tableInfo, typeTable }) {

    return (
        <div>
            {tableInfo ? (
                <div>
                    <table border="1">
                        <thead>
                            <tr>
                                {tableInfo.header.map((variable, variableIndex) => (
                                    <th key={variableIndex}>{variable}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {typeTable.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td>{rowIndex + 1}</td>
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

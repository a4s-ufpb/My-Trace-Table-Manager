import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TraceTableContext } from "../../../contexts/TraceTableContext";

export default function NewExercice() {
    const { setTraceData } = useContext(TraceTableContext);
    const [file, setFile] = useState(null)
    const [qtdVariables, setVariables] = useState(1)
    const [qtdSteps, setSteps] = useState(1)

    const navigate = useNavigate()

    const [lastTable, setLastTable] = useState(null);
    
    useEffect(() => {
        const tables = JSON.parse(localStorage.getItem("traceTables")) || [];
        if (tables.length > 0) {
            setLastTable(tables[tables.length - 1]); // Pegando a última tabela salva
        }
    }, []);

    function handleFileChange(event) {
        setFile(event.target.files[0])
    }

    function handleSubmit(event) {
        event.preventDefault();
        const newId = lastTable ? lastTable.id + 1 : 1;
        setTraceData({ id: newId, file, qtdVariables, qtdSteps });
        navigate("/showntable");
    }

    return (
        <div className="background">
            <p className="stage">Etapa 1/3</p>
            <h2>Cadastrar nova Trace-Table</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="img-tracetable">Forneça a imagem do código</label>
                    <input
                        type="file" 
                        name="img-tracetable" 
                        id="img-tracetable" 
                        required
                        onChange={handleFileChange}
                    />
                </div>
                <div>
                    <label htmlFor="quant-variables">Quantidade de variáveis do código</label>
                    <input 
                        type="number" 
                        name="quant-variables" 
                        id="quant-variables" 
                        min="1" 
                        required
                        value={qtdVariables}
                        onChange={(e) => setVariables(parseInt(e.target.value))}
                    />
                </div>
                <div>
                    <label htmlFor="quant-steps">Quantidade de passos que a trace table vai ter</label>
                    <input
                        type="number" 
                        name="quant-steps" 
                        id="quant-steps" 
                        min="1" 
                        required
                        value={qtdSteps}
                        onChange={(e) => setSteps(parseInt(e.target.value))}
                    />
                </div>
                <button type="submit">Gerar Trace Table editável</button>
            </form>
        </div>
    )
}
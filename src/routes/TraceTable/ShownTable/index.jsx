import { useContext, useEffect, useState } from "react";
import { TraceTableContext } from "../../../contexts/TraceTableContext";
import { useNavigate } from "react-router-dom";
import "../traceTable.css";
import { BsQuestionCircleFill } from "react-icons/bs";
import AttentionPopUp from "../../../components/AttentionPopUp";
import useTraceTableCollection from "../../../hooks/useTraceTableCollection";
import HelpPopUp from "../../../components/HelpPopUp";
import ImageModal from "../../../components/ImageModal";

export default function ShownTable() {

    const navigate = useNavigate();
    const [openPopUp, setOpenPopUp] = useState(false);
    const [openHelpPopUp, setOpenHelpPopUp] = useState(false);
    const [imageURL, setImageURL] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { traceData, setTraceData } = useContext(TraceTableContext);
    const { getLastTraceTable } = useTraceTableCollection();

    const [headerTable, setHeaderTable] = useState(traceData.showSteps && traceData.showRowsCol ?
        ["Passo", "Linha", ...Array(traceData.qtdVariables).fill('')]
        : traceData.showRowsCol ?
            ["Linha", ...Array(traceData.qtdVariables).fill('')]
            : ["Passo", ...Array(traceData.qtdVariables).fill('')]
    );

    const extraCols = (traceData.showSteps ? 1 : 0) + (traceData.showRowsCol ? 1 : 0);

    const [shownTableData, setShownTableData] = useState(
        Array(traceData.qtdSteps)
            .fill()
            .map(() => Array(traceData.qtdVariables + extraCols).fill(''))
    );

    const [isValid, setIsValid] = useState(false)

    useEffect(() => {
        if (Array.isArray(traceData.shownTable) && traceData.shownTable.length > 0) {
            setShownTableData(traceData.shownTable);
            setHeaderTable(traceData.headerTable);
        }
    }, []);

    useEffect(() => {
        if (traceData.image) {
            const url = URL.createObjectURL(traceData.image);
            setImageURL(url);

            return () => URL.revokeObjectURL(url);
        }
    }, [traceData.image]);

    useEffect(() => {
        const allFilled = shownTableData.every(row =>
            row
                .slice(traceData.showSteps ? 1 : 0)
                .every(cell => cell.trim() !== ''));

        setIsValid(allFilled);
    }, [shownTableData, traceData.showSteps]);

    useEffect(() => {
        const lastTable = getLastTraceTable();
        if (lastTable && lastTable.id === traceData.id) {
            setHeaderTable(lastTable.header);
            setShownTableData(lastTable.shownTable);
        }
    }, [traceData.id]);

    const shownPopUp = () => {
        setOpenPopUp(true);
    }

    const showHelpPopUp = () => {
        setOpenHelpPopUp(true);
    };

    const cancelOperation = () => {
        navigate("/");
    }

    const handleInputChange = (row, col, value) => {
        setShownTableData(prevData => {
            const newTableData = prevData.map((r, i) =>
                i === row ? r.map((c, j) => (j === col ? value : c)) : r
            );
            return newTableData;
        });
    };

    const handleHeaderChange = (col, value) => {
        setHeaderTable(prevHeader => {
            const newHeader = [...prevHeader];
            newHeader[col] = value;
            return newHeader;
        });
    }

    const handleImageClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="background">
            <div className="wrapper">
                {imageURL && (
                    <div className="img-container">
                        <img
                            src={imageURL}
                            alt="Código do exercício"
                            onClick={handleImageClick}
                        />
                    </div>
                )}
                <div className="trace-container">
                    <div className="title-container">
                        <div className="content-with-help">
                            <h2>Tabela Mostrada</h2>
                            <BsQuestionCircleFill className="icon-question" onClick={showHelpPopUp} />
                        </div>

                        <span className="table-subtitle">Configure a tabela a ser mostrada no exercício</span>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                {headerTable.map((header, i) => (
                                    <th key={i}>
                                        {i > extraCols - 1 ? (
                                            <input
                                                type="text"
                                                value={header}
                                                onChange={(e) => handleHeaderChange(i, e.target.value)}
                                                maxLength={8}
                                                placeholder={`Var${i - extraCols + 1}`}
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
                                    {row.map((cell, j) => {
                                        const isStepCol = traceData.showSteps && j === 0;

                                        return (
                                            <td key={j} className={isStepCol ? "step-cell" : ""}>
                                                {isStepCol ? (
                                                    `${i + 1}º`
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={cell}
                                                        maxLength={10}
                                                        onChange={(e) => handleInputChange(i, j, e.target.value)}
                                                    />
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="btn-container">
                <button
                    className="btn btn-next"
                    onClick={() => {
                        setTraceData({
                            ...traceData,
                            shownTable: shownTableData,
                            headerTable: headerTable,
                        });
                        navigate("/expectedtable")
                    }
                    }
                    disabled={!isValid}
                >Prosseguir</button>
                <button onClick={shownPopUp} className="btn">Cancelar</button>
            </div>
            {
                openPopUp && (
                    <AttentionPopUp
                        text="Tem certeza que deseja cancelar a operação? Seus dados não serão salvos!"
                        confirmAction={cancelOperation}
                        cancelAction={() => setOpenPopUp(false)}
                    />
                )
            }
            {
                openHelpPopUp && (
                    <HelpPopUp
                        text="O professor deve marcar as células que o aluno pode editar com '?'. 
                    As células que não podem ser alteradas devem ser preenchidas com '#'. Se quiser, também pode
                    já deixar valores preenchidos nas células."
                        onClose={() => setOpenHelpPopUp(false)}
                    />
                )
            }
            <ImageModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                imageSrc={imageURL}
            />
        </div >
    );
}

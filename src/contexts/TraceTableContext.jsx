import { createContext, useState } from "react";

export const TraceTableContext = createContext();

export function TraceTableProvider({ children }) {
    const [traceData, setTraceData] = useState({
        id: 1,
        image: null,
        exerciseName: "",
        qtdVariables: 1,
        qtdRows: 1,
        showSteps: true,
        showRowsCol: true,
        themesIds: [],
        shownTable: [],
        expectedTable: [],
        headerTable: [],
        typeTable: [],
        programmingLanguage: "python",
    });

    return (
        <TraceTableContext.Provider value={{ traceData, setTraceData }}>
            {children}
        </TraceTableContext.Provider>
    );
}
import { createContext, useState } from "react";

export const TraceTableContext = createContext();

export function TraceTableProvider({ children }) {
    const [traceData, setTraceData] = useState({
        id: 1,
        image: null,
        qtdVariables: 1,
        qtdRows: 1,
        showSteps: "yes",
        themesIds: [],
        shownTable: [],
        expectedTable: [],
        headerTable: [],
    });

    return (
        <TraceTableContext.Provider value={{ traceData, setTraceData }}>
            {children}
        </TraceTableContext.Provider>
    );
}
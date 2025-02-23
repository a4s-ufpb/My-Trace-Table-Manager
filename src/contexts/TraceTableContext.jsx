import { createContext, useState } from "react";

export const TraceTableContext = createContext();

export function TraceTableProvider({ children }) {
    const [traceData, setTraceData] = useState({
        id: 1,
        file: null,
        qtdVariables: 1,
        qtdSteps: 1,
        themes: [],
    });

    return (
        <TraceTableContext.Provider value={{ traceData, setTraceData }}>
            {children}
        </TraceTableContext.Provider>
    );
}
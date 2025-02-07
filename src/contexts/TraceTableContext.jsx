import { createContext, useState } from "react";

export const TraceTableContext = createContext();

export function TraceTableProvider({ children }) {
    const [traceData, setTraceData] = useState({
        id: 0,
        theme: "",
        file: null,
        variables: 1,
        steps: 1,
        initialLine: 1,
    });

    return (
        <TraceTableContext.Provider value={{ traceData, setTraceData }}>
            {children}
        </TraceTableContext.Provider>
    );
}
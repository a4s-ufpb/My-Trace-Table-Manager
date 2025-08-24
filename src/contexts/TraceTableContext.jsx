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

    const [exerciseDraft, setExerciseDraft] = useState(null);

    const clearExerciseDraft = () => {
        setExerciseDraft(null);
    };

    return (
        <TraceTableContext.Provider value={{ traceData, setTraceData, exerciseDraft, setExerciseDraft, clearExerciseDraft }}>
            {children}
        </TraceTableContext.Provider>
    );
}
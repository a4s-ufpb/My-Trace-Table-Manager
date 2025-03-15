import { useState, useEffect } from "react";

export default function useTraceTableCollection() {
    const [traceTables, setTraceTables] = useState(() => {
        return JSON.parse(localStorage.getItem("traceTables")) || [];
    });

    useEffect(() => {
        if (traceTables.length > 0) {
            localStorage.setItem("traceTables", JSON.stringify(traceTables));
        }
    }, [traceTables]);

    const addTraceTable = (newTable) => {
        setTraceTables(prevTables => {
            const updatedTables = prevTables.filter(t => t.id !== newTable.id);
            return [...updatedTables, newTable];
        });
        console.log("Tabelas após salvar:", traceTables);

    };

    const removeTraceTable = (id) => {
        setTraceTables(prevTables => prevTables.filter(table => table.id !== id));
    };

    const getLastTraceTable = () => {
        return traceTables.length > 0 ? traceTables[traceTables.length - 1] : null;
    };

    return { traceTables, addTraceTable, removeTraceTable, getLastTraceTable };
}

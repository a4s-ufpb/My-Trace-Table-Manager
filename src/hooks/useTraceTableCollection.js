import { useState, useEffect } from "react";

export default function useTraceTableCollection() {
    const [traceTables, setTraceTables] = useState([]);
    const getToken = () => localStorage.getItem('token');
    const getUserId = () => localStorage.getItem('userId');

    useEffect(() => {
        const token = getToken();
        const userId = getUserId();

        if (!token) {
            alert("Usuário não autenticado!");
            return;
        }

        fetch(`http://localhost:8080/v1/trace/user/${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao carregar tabelas de rastreamento!");
            }
            return response.json();
        })
        .then(data => setTraceTables(data.content || []))
        .catch(error => console.error("Erro ao carregar tabelas:", error));
    }, []);

    const addTraceTable = (newTable, image, themesIds) => {
        const token = getToken();
        const userId = getUserId();
        if (!token) {
            alert("Usuário não autenticado!");
            return;
        }

        console.log("(Hook) Themes ID:", themesIds);
        console.log("(Hook) Image:", image);
        console.log("(Hook) Trace Table Request:", newTable);

        const queryParams = themesIds.map(id => `themesIds=${id}`).join("&");

        const formData = new FormData();
        formData.append("traceTableRequest", JSON.stringify(newTable));
        formData.append("image", image);

        fetch(`http://localhost:8080/v1/trace/${userId}?${queryParams}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            setTraceTables(prevTables => {
                const updatedTables = prevTables.filter(t => t.id !== newTable.id);
                return [...updatedTables, data];
            });
        })
        .catch(error => console.error("Erro ao cadastrar Trace Table:", error));

        console.log("Tabelas após salvar:", traceTables);
    };

    const removeTraceTable = (id) => {
        const token = getToken();
        const userId = getUserId();
        if (!token) {
            alert("Usuário não autenticado!");
            return;
        }

        fetch(`http://localhost:8080/v1/trace/${id}/${userId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            if (response.ok) {
                setTraceTables(prevTables => prevTables.filter(table => table.id !== id));
            } else {
                alert("Erro ao remover Trace Table!");
            }
        })
        .catch(error => console.error("Erro ao remover Trace Table:", error));
    };

    const getLastTraceTable = () => {
        return traceTables.length > 0 ? traceTables[traceTables.length - 1] : null;
    };

    return { traceTables, addTraceTable, removeTraceTable, getLastTraceTable };
}
import { useState, useEffect } from "react";

export default function useTraceTableCollection() {
    const [traceTables, setTraceTables] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage] = useState(6);
    const [filteredTheme, setFilteredTheme] = useState({id: null, name: "todos"});

    const getToken = () => localStorage.getItem('token');
    const getUserId = () => localStorage.getItem('userId');

    useEffect(() => {
        const token = getToken();
        const userId = getUserId();

        if (!token) {
            alert("Usuário não autenticado!");
            return;
        }

        const fetchData = async () => {
            let data;
            if (filteredTheme.name === "todos") {
                data = await getTraceTables(userId);
            } else {
                data = await getTraceTablesByTheme();
            }
            setTraceTables(data.content || []);
            setTotalPages(data.totalPages);
        }

        fetchData();
    }, [currentPage, filteredTheme]);

    const getTraceTables = async (userId) => {
        const token = getToken();
        const response = await fetch(`http://localhost:8080/v1/trace/user/${userId}?page=${currentPage}&size=${itemsPerPage}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Erro ao carregar trace tables!");
        }

        return await response.json();
    };

    const getTraceTablesByTheme = async () => {
        const token = getToken();
        const response = await fetch(`http://localhost:8080/v1/trace/theme/${filteredTheme.id}?page=${currentPage}&size=${itemsPerPage}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Erro ao carregar tabelas filtradas por tema!");
        }

        return await response.json();
    };

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
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao cadastrar a trace table!");
                }
                return response.json();
            })
            .then(data => {
                setTraceTables(prevTables => {
                    const updatedTables = prevTables.filter(t => t.id !== newTable.id);
                    return [...updatedTables, data];
                });
            })
            .catch(error => console.error("Erro ao cadastrar Trace Table:", error));

        console.log("Tabelas após salvar:", traceTables);
    };

    const editTraceTable = (id, newTable) => {
        const token = getToken();
        const userId = getUserId();
        if (!token) {
            alert("Usuário não autenticado!");
            return;
        }

        fetch(`http://localhost:8080/v1/trace/${id}/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(newTable),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao atualizar a trace table!");
                }
                return response.json();
            })
            .then(data => {
                setTraceTables(prevTables => {
                    prevTables.map(table => {
                        table.id === id ? data : table;
                    })
                });
            })
            .catch(error => console.error("Erro ao editar Trace Table:", error));
    }

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
                    setTraceTables(prevTables => {
                        const updatedTables = prevTables.filter(table => table.id !== id);
                        if (updatedTables.length === 0 && currentPage > 0) {
                            setCurrentPage(currentPage - 1);
                        }
                        return updatedTables;
                    });
                } else {
                    alert("Erro ao remover Trace Table!");
                }
            })
            .catch(error => console.error("Erro ao remover Trace Table:", error));
    };

    const getLastTraceTable = () => {
        return traceTables.length > 0 ? traceTables[traceTables.length - 1] : null;
    };

    const changePage = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    }

    const setFilteredThemeAndResetPage = (theme) => {
        setFilteredTheme(theme);
        setCurrentPage(0);
    };

    return { traceTables, addTraceTable, editTraceTable, removeTraceTable, getLastTraceTable, getTraceTablesByTheme, currentPage, totalPages, changePage, filteredTheme, setFilteredThemeAndResetPage };
}
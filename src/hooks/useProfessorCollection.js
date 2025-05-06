import { useEffect, useState } from "react";

export default function useProfessorCollection() {
    const [professors, setProfessors] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage] = useState(5);

    const getToken = () => localStorage.getItem('token');

    useEffect(() => {

        const token = getToken();
        if (!token) {
            alert("Usuário não autenticado!");
            return;
        }

        fetch(`http://localhost:8080/v1/user/all?page=${currentPage}&size=${itemsPerPage}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
            .then(response => response.json())
            .then(data => {
                setProfessors(data.content);
                setTotalPages(data.totalPages);
            })
            .catch(error => console.error("Erro ao carregar professores:", error));
    }, [currentPage, professors]);

    const addProfessor = (name, email, password, role) => {
        const token = getToken();
        if (!token) {
            alert("Usuário não autenticado!");
            return;
        }

        const newProfessor = { name, email, password, role };

        fetch("http://localhost:8080/v1/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(newProfessor),
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                } else {
                    setProfessors([...professors, data])
                    alert("Professor cadastrado com sucesso!");
                }
            })
            .catch(error => console.error("Erro ao cadastrar profesor:", error));
    }

    const removeProfessor = (id) => {
        const token = getToken();
        if (!token) {
            alert("Usuário não autenticado!");
            return;
        }

        fetch(`http://localhost:8080/v1/user/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.ok) {
                    setProfessors(prevProfessors => {
                        const updatedProfessors = prevProfessors.filter(professor => professor.id !== id);
                        if (updatedProfessors.length === 0 && currentPage > 0) {
                            setCurrentPage(currentPage - 1);
                        }
                        return updatedProfessors;
                    });
                } else {
                    alert("Você não tem permição para remover!");
                }
            })
            .catch(error => console.error("Erro ao remover professor:", error));
    };

    const editProfessor = (id, userUpdate) => {
        const token = getToken();
        if (!token) {
            alert("Usuário não autenticado!");
            return;
        }

        fetch(`http://localhost:8080/v1/user/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(userUpdate),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao atualizar o professor!");
                }
                return response.json();
            })
            .then(data => {
                setProfessors(prevProfessors =>
                    prevProfessors.map(professor =>
                        professor.id === id ? data : professor
                    )
                );
            })
            .catch(error => console.error("Erro ao editar professor:", error));
    }

    const changePage = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    }

    return { professors, addProfessor, editProfessor, removeProfessor, currentPage, totalPages, changePage };
}
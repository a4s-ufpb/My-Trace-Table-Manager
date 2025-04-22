import { useEffect, useState } from "react";

export default function useProfessorCollection() {

    const [professors, setProfessors] = useState([]);

    const getToken = () => localStorage.getItem('token');

    useEffect(() => {

        const token = getToken();
        if (!token) {
            alert("Usuário não autenticado!");
            return;
        }

        fetch("http://localhost:8080/v1/user/all?page=0&size=10", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
            .then(response => response.json())
            .then(data => setProfessors(data.content))
            .catch(error => console.error("Erro ao carregar professores:", error));
    }, []);

    const addProfessor = (name, email, password) => {
        const token = getToken(); // Pegando o token salvo
        if (!token) {
            alert("Usuário não autenticado!");
            return;
        }

        const newProfessor = { name, email, password };

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
                    setProfessors(professors.filter(professor => professor.id !== id));
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


    return { professors, addProfessor, editProfessor, removeProfessor };
}
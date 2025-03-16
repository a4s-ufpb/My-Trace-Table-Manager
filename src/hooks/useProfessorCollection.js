import { useState } from "react";

export default function useProfessorCollection() {

    const[professors, setProfessors] = useState(() => {
        return JSON.parse(localStorage.getItem("traceTables")) || [];
    })

    const addProfessor = (name, user, password) => {
        const lastId = professors.length > 0 ? professors[professors.length - 1].id : 0;
        const newProfessor = { id: lastId + 1, name: name, user: user, password: password };

        const updatedProfessors = [...professors, newProfessor];

        localStorage.setItem("professors", JSON.stringify(updatedProfessors));

        setProfessors(updatedProfessors);

        console.log("professor cadastrado:", newProfessor)
        console.log("professores cadastrados:", professors)
    }

    const removeProfessor = (id) => {
        setProfessors(state => {
            const newState = state.filter(professor => professor.id !== id)
            localStorage.setItem("professors", JSON.stringify(newState))
            return newState
        })
    }

    return { professors, addProfessor, removeProfessor };
}
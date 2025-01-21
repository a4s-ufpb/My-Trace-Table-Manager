import { useNavigate, useOutletContext } from "react-router-dom";
import Button from "../../../components/Button";
import "./index.css"
import { useState } from "react";

export default function NewProfessor() {
    const navigate = useNavigate();
    const { professors, setProfessors } = useOutletContext();
    const [name, setName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            const newProfessor = {
                id: professors.length + 1,
                name: name.trim(),
            };

            setProfessors((prevProfessors) => [...prevProfessors, newProfessor]);
            navigate("/professor");
        }
    };

    return (
        <div className="background">
            <form>
                <div>
                    <label htmlFor="name">Nome:</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        required 
                        min="2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <Button text="Cadastrar" action={handleSubmit} />
            </form>
        </div>
    )
}
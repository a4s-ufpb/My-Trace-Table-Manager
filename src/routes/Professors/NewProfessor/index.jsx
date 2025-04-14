import { useState } from "react";
import useProfessorCollection from "../../../hooks/useProfessorCollection";
import { useNavigate } from "react-router-dom";
import ItemList from "../../../components/ListItems";

export default function NewProfessor() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { professors, addProfessor, editProfessor, removeProfessor,  } = useProfessorCollection();
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        addProfessor(name, email, password);
        setName("");
        setEmail("");
        setPassword("");
    }

    return (
        <div className="background">
            <div className="form-bg">
                <h2>Cadastrar novo professor</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name">Nome:</label>
                        <input
                            className="form-input"
                            type="text"
                            name="name"
                            id="name"
                            minLength="3"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Ex.: Ayla Rebouças"
                        />
                    </div>
                    <div>
                        <label htmlFor="user">Email:</label>
                        <input
                            className="form-input"
                            type="email"
                            name="user"
                            id="user"
                            minLength="3"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Ex.: ayla@gmail.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Senha:</label>
                        <input
                            className="form-input"
                            type="password"
                            name="password"
                            id="password"
                            minLength="5"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Ex.: A4S2025#"
                        />
                    </div>
                    <div className="btn-container">
                        <button type="submit" className="btn btn-next">Cadastrar</button>
                        <button type="button" onClick={() => navigate("/")} className="btn">Voltar</button>
                    </div>
                </form>
                {professors.length > 0 ? (
                    <ItemList
                        items={professors}
                        title="Professores cadastrados"
                        removeItem={removeProfessor}
                        editItem={editProfessor}
                    />
                ) : <span className="span-items">Ainda não há professores cadastrados</span>}
            </div>
        </div>
    )
}

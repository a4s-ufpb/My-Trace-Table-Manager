import { useState } from "react";
import useProfessorCollection from "../../../hooks/useProfessorCollection";
import { useNavigate } from "react-router-dom";
import ItemList from "../../../components/ListItems";

export default function NewProfessor() {
    const [name, setName] = useState("");
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const { professors, addProfessor, removeProfessor } = useProfessorCollection();
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        addProfessor(name, user, password);
        setName("");
        setUser("");
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
                        <label htmlFor="user">Usuário:</label>
                        <input
                            className="form-input"
                            type="text"
                            name="user"
                            id="user"
                            minLength="3"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            required
                            placeholder="Ex.: ayla_r"
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
                    />
                ) : <span className="span-items">Ainda não há professores cadastrados</span>}
            </div>
        </div>
    )
}

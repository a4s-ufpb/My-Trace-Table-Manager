import { useState } from "react";
import useProfessorCollection from "../../../hooks/useProfessorCollection";
import { useNavigate } from "react-router-dom";
import ListItems from "../../../components/ListItems";

export default function NewProfessor() {
    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [onEdit, setOnEdit] = useState(false);
    const { professors, addProfessor, editProfessor, removeProfessor, } = useProfessorCollection();
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        addProfessor(name, email, password, role);
        setName("");
        setEmail("");
        setPassword("");
        setRole("user");
    }

    const handleEdit = (professor) => {
        setEditingId(professor.id);
        setName(professor.name);
        setEmail(professor.email);
        setPassword("");
        setRole(professor.role);
        setOnEdit(true);
    }

    const saveEdit = () => {
        if (!name || !email || !role) {
            alert("Todos os campos são obrigatórios!");
            return;
        }

        const userUpdate = {
            name,
            email,
            role
        };

        if (password) {
            userUpdate.password = password;
        }

        editProfessor(editingId, userUpdate);
        clear();
    };

    const clear = () => {
        setEditingId(null);
        setName("");
        setEmail("");
        setPassword("");
        setRole("user");
        setOnEdit(false);
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
                        />
                    </div>
                    <div>
                        <label htmlFor="role">Papel</label>
                        <select
                            className="form-input"
                            name="role"
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="user">Usuário padrão</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    <div className="btn-container">
                        {onEdit ? (
                            <>
                                <button type="button" className="btn" onClick={saveEdit}>Salvar</button>
                                <button
                                    type="button"
                                    onClick={() => clear()} className="btn"
                                >Cancelar</button>
                            </>
                        ) : (
                            <button type="submit" className="btn btn-next">Cadastrar</button>
                        )}
                        <button type="button" onClick={() => navigate("/")} className="btn">Voltar</button>
                    </div>
                </form>
                {professors.length > 0 ? (
                    <ListItems
                        items={professors}
                        title="Professores cadastrados"
                        removeItem={removeProfessor}
                        editItem={editProfessor}
                        itemType="professor"
                        onEdit={handleEdit}
                    />
                ) : <span className="span-items">Ainda não há professores cadastrados</span>}
            </div>
        </div>
    )
}

import { useState } from "react";
import useProfessorCollection from "../../../hooks/useProfessorCollection";
import { useNavigate } from "react-router-dom";
import ListItems from "../../../components/ListItems";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import InvalidPopUp from "../../../components/InvalidPopUp";

export default function NewProfessor() {
    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [onEdit, setOnEdit] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showInvalidPopUp, setShowInvalidPopUp] = useState(false);
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
            setShowInvalidPopUp(true);
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
                {onEdit ? <h2>Editar professor</h2> : <h2>Cadastrar novo professor</h2>}
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
                        <div className="password-container">
                            <input
                                className="form-input"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                minLength="8"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span
                                className="password-toggle"
                                tabIndex="0"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <BsEyeSlash /> : <BsEye />}
                            </span>
                        </div>
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
                                <button type="button" onClick={saveEdit} className="btn">Salvar</button>
                                <button type="button" onClick={clear} className="btn">Cancelar</button>
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
            {showInvalidPopUp && (
                <InvalidPopUp message="Preencha os campos corretamente!" showPopUp={setShowInvalidPopUp} />
            )}
        </div>
    )
}

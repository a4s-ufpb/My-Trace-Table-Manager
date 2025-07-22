import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListItems from "../../../components/ListItems";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import MessagePopUp from "../../../components/MessagePopUp";
import PageChanging from "../../../components/PageChanging";
import { ProfessorService } from "../../../service/ProfessorService";

export default function NewProfessor() {
    const [professors, setProfessors] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [onEdit, setOnEdit] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState("");
    const navigate = useNavigate();

    const service = new ProfessorService();

    useEffect(() => {
        fetchProfessors();
    }, [currentPage]);

    const fetchProfessors = async () => {
        const response = await service.getAllPaginated(currentPage, 5);
        if (response.success) {
            setProfessors(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
        } else {
            setPopUpMessage(response.message || "Erro ao buscar professores");
            setShowMessagePopUp(true);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await service.registerProfessor(
            { name, email, password, role }
        );

        if (response.success) {
            setPopUpMessage("Professor cadastrado com sucesso!");
            fetchProfessors();
            clear();
        } else {
            setPopUpMessage(response.message || "Erro ao cadastrar professor");
        }

        setShowMessagePopUp(true);
    }

    const handleEdit = (professor) => {
        setEditingId(professor.id);
        setName(professor.name);
        setEmail(professor.email);
        setPassword("");
        setRole(professor.role);
        setOnEdit(true);
    }

    const saveEdit = async () => {
        if (!name || !email || !role) {
            setPopUpMessage("Preencha os campos corretamente!");
            setShowMessagePopUp(true);
            return;
        }

        const userUpdate = { name, email, role };

        if (password) userUpdate.password = password;

        const response = await service.updateProfessor(editingId, userUpdate);

        if (response.success) {
            setPopUpMessage("Professor atualizado com sucesso!");
            localStorage.setItem("user", JSON.stringify(response.data));
            localStorage.setItem("userRole", response.data.role);
            fetchProfessors();
            clear();
        } else {
            setPopUpMessage(response.message || "Erro ao atualizar professor");
        }

        setShowMessagePopUp(true);
    };

    const clear = () => {
        setEditingId(null);
        setName("");
        setEmail("");
        setPassword("");
        setRole("user");
        setOnEdit(false);
    }

    const handleDelete = async (id) => {
        const response = await service.deleteProfessor(id);
        if (response.success) {
            setPopUpMessage("Professor removido com sucesso!");
            setShowMessagePopUp(true);
            fetchProfessors();
        } else {
            setPopUpMessage(response.message || "Erro ao remover professor");
            setShowMessagePopUp(true);
        }
    };

    const changePage = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

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
                        removeItem={handleDelete}
                        editItem={handleEdit}
                        itemType="professor"
                        onEdit={handleEdit}
                        editingId={editingId}
                    />
                ) : <span className="span-items">Ainda não há professores cadastrados</span>}
                <PageChanging
                    changePage={changePage}
                    currentPage={currentPage}
                    totalPages={totalPages}
                />
            </div>
            {showMessagePopUp && (
                <MessagePopUp
                    message={popUpMessage}
                    showPopUp={setShowMessagePopUp}
                />
            )}
        </div>
    )
}

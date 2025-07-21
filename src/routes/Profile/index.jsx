import { useEffect, useState } from "react";
import useProfessorCollection from "../../hooks/useProfessorCollection";
import { useNavigate } from "react-router-dom";
import { BsEye, BsEyeSlash, BsQuestionCircleFill } from "react-icons/bs";
import HelpPopUp from "../../components/HelpPopUp";
import MessagePopUp from "../../components/MessagePopUp";
import { ProfessorService } from "../../service/ProfessorService";

export default function Profile() {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState("");
    const [openHelpPopUp, setOpenHelpPopUp] = useState(false);
    const navigate = useNavigate();

    const service = new ProfessorService();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setId(user.id);
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
        }
    }, []);

    const saveEdit = async () => {
        if (!name || !email) {
            setPopUpMessage("Preencha os campos corretamente!");
            setShowMessagePopUp(true);
            return;
        }

        const userUpdate = { name, email, role };

        if (password) userUpdate.password = password;

        const response = await service.updateProfessor(id, userUpdate);

        if (response.success) {
            localStorage.setItem("user", JSON.stringify(res.data));
            localStorage.setItem("userRole", res.data.role);
            setPopUpMessage("Usuário editado com sucesso!");
        } else {
            setPopUpMessage(response.message || "Erro ao editar usuário");
        }

        setShowMessagePopUp(true);
    };

    const showHelpPopUp = () => {
        setOpenHelpPopUp(true);
    };

    return (
        <div className="background">
            <div className="form-bg">
                <div className="content-with-help">
                    <h2>Perfil</h2>
                    <BsQuestionCircleFill className="icon-question" onClick={showHelpPopUp} />
                </div>
                <form>
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
                        <label>Papel</label>
                        <span>
                            {role === "admin" ? "Administrador" : "Usuário padrão"}
                        </span>
                    </div>
                    <div className="btn-container">
                        <button type="button" onClick={saveEdit} className="btn">Salvar</button>
                        <button type="button" onClick={() => navigate("/")} className="btn">Voltar</button>
                    </div>
                </form>
            </div>
            {showMessagePopUp && (
                <MessagePopUp
                    message={popUpMessage}
                    showPopUp={setShowMessagePopUp}
                />
            )}
            {openHelpPopUp && (
                <HelpPopUp
                    text="O usuário pode alterar o 'Nome', 'Email' e 'Senha' apenas digitando a nova informação desejada em seu respectivo campo e clicando no botão de salvar. A senha atual nunca é exibida, então caso o usuário opte em não realizar nenhuma alteração neste campo, sua senha permanecerá a mesma."
                    onClose={() => setOpenHelpPopUp(false)}
                />
            )}
        </div>
    )
}

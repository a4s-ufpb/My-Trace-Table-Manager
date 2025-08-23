import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MessagePopUp from "../../components/MessagePopUp";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { AuthService } from "../../service/AuthService";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState("");

    const navigate = useNavigate();
    const authService = new AuthService();

    const handleLogin = async (e) => {
        e.preventDefault();

        const loginResult = await authService.login(email, password);

        if (!loginResult.success) {
            setPopUpMessage(loginResult.message || "Credenciais inválidas");
            setShowMessagePopUp(true);
            return;
        }

        const { token, expiresIn } = loginResult.data;
        const expirationTime = Date.now() + expiresIn * 1000;

        localStorage.setItem("token", token);
        localStorage.setItem("tokenExpiration", expirationTime);

        const userResult = await authService.getUserData(token);
        if (userResult.success) {
            const userData = userResult.data;
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("userId", userData.id);
            localStorage.setItem("userRole", userData.role);
            navigate("/");
        } else {
            setPopUpMessage(userResult.message || "Erro ao buscar dados do usuário");
            setShowMessagePopUp(true);
        }
    };

    const emailAddress = "a4s@dcx.ufpb.br";
    const subject = "Solicitação%20de%20Cadastro";
    const body = "Olá,%20gostaria%20de%20solicitar%20meu%20cadastro%20na%20plataforma%20My%20Trace%20Table%20Manager.";
    const mailtoLink = `mailto:${emailAddress}?subject=${subject}&body=${body}`;

    return (
        <div className="background">
            <div className="form-bg">
                <form onSubmit={handleLogin} data-testid="login-form">
                    <h2>Login</h2>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            maxLength="100"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="form-input"
                            data-testid="login-email-input"
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Senha</label>
                        <div className="password-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                maxLength="100"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="form-input"
                                data-testid="login-password-input"
                            />
                            <span
                                className="password-toggle"
                                tabIndex="0"
                                onClick={() => setShowPassword(!showPassword)}
                                data-testid="login-password-toggle"
                            >
                                {showPassword ? <BsEyeSlash /> : <BsEye />}
                            </span>
                        </div>
                    </div>
                    <button type="submit" className="btn" data-testid="login-submit-button">Entrar</button>
                </form>
                <span className="without-registration">Não tem cadastro? Entre em contato com <a href={mailtoLink}>{emailAddress}</a></span>
            </div>

            {showMessagePopUp && (
                <MessagePopUp
                    message={popUpMessage}
                    showPopUp={setShowMessagePopUp}
                />
            )}
        </div>
    );
}

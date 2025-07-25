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

    return (
        <div className="background">
            <div className="form-bg">
                <form onSubmit={handleLogin}>
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
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Senha</label>
                        <div className="password-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                minLength="8"
                                maxLength="20"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="form-input"
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
                    <button type="submit" className="btn">Entrar</button>
                </form>
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

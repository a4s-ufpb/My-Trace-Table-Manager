import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MessagePopUp from "../../components/MessagePopUp";
import { BsEye, BsEyeSlash } from "react-icons/bs";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const userLogin = {
            email: email,
            password: password
        };

        try {
            const response = await fetch('http://localhost:8080/v1/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userLogin),
            });

            if (response.ok) {
                console.log("Autenticação realizada com sucesso!");
                const data = await response.json();
                const { token, expiresIn } = data;
                console.log("Token: ", token);

                const expirationTime = Date.now() + expiresIn * 1000;

                localStorage.setItem('token', token);
                localStorage.setItem('tokenExpiration', expirationTime);

                console.log("Iniciando busca de dados do usuário...");
                const userResponse = await fetch('http://localhost:8080/v1/user/find', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (userResponse.ok) {
                    console.log("Dados do usuário obtidos com sucesso!");
                    const userData = await userResponse.json();
                    localStorage.setItem('user', JSON.stringify(userData));
                    localStorage.setItem('userId', userData.id);
                    localStorage.setItem('userRole', userData.role);
                    navigate('/');
                } else {
                    console.error("Erro ao buscar dados do usuário:", userResponse.status);
                }

            } else {
                setShowMessagePopUp(true);
            }
        } catch (error) {
            console.error("Erro ao autenticas", error);
            alert('Erro ao autenticar. Tente novamente.');
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
                    message={"Credenciais inválidas"}
                    showPopUp={setShowMessagePopUp}
                />
            )}
        </div>
    );
}

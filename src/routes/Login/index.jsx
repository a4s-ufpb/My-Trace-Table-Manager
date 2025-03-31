import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
                const data = await response.json();
                const { token } = data;

                localStorage.setItem('token', token);

                const userResponse = await fetch('http://localhost:8080/v1/user/find', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    localStorage.setItem('userId', userData.id);
                    localStorage.setItem('userRole', userData.role);
                    navigate('/');
                } else {
                    alert('Erro ao buscar dados do usuário');
                }

            } else {
                alert('Credenciais inválidas');
            }
        } catch (error) {
            console.error("Erro ao autenticas", error);
            alert('Erro ao autenticar. Tente novamente.');
        }
    };

    return (
        <div className={styles.loginContainer}>
            <form onSubmit={handleLogin} className={styles.form}>
                <h2 className={styles.title}>Login</h2>

                <div className={styles.inputGroup}>
                    <label htmlFor="email" className={styles.label}>Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="password" className={styles.label}>Senha</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>
                <button type="submit" className="btn">Entrar</button>
            </form>
        </div>
    );
}

import { useState } from "react";
import { BsTrash } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import useThemeCollection from "../../../hooks/useThemeCollection";
import styles from "./styles.module.css";

export default function NewTheme() {
    const [theme, setTheme] = useState("");
    const { themes, addTheme, removeTheme } = useThemeCollection();
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        addTheme(theme);
        setTheme("");
    }

    return (
        <div className="background">
            <div className="form-bg">
                <h2>Cadastrar novo tema</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="theme">Informe o tema que você deseja cadastrar</label>
                        <input
                            className="form-input"
                            type="text"
                            name="theme"
                            id="theme"
                            minLength="2 "
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            required
                        />
                    </div>
                    <div className="btn-container">
                        <button type="submit" className="btn-next">Cadastrar</button>
                        <button type="button" onClick={() => navigate("/")} className="btn-cancel">Voltar</button>
                    </div>
                </form>
                {themes.length > 0 ? (
                    <div className={styles.themeContainer}>
                        <h4>Temas Cadastrados</h4>
                        <div className={styles.themeList}>
                            {themes.map((theme, i) => (
                                <div key={i} className={styles.themeItem}>
                                    <span>{theme.name}</span>
                                    <BsTrash
                                        className="icon-trash"
                                        onClick={() => removeTheme(theme.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : <span className={styles.spanThemes}>Ainda não há temas cadastrados</span>}
            </div>
        </div>
    )
}
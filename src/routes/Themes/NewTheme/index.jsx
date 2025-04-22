import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useThemeCollection from "../../../hooks/useThemeCollection";
import ListItems from "../../../components/ListItems";

export default function NewTheme() {
    const [theme, setTheme] = useState("");
    const { themes, addTheme, editTheme, removeTheme } = useThemeCollection();
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
                            minLength="2"
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            required
                        />
                    </div>
                    <div className="btn-container">
                        <button type="submit" className="btn">Cadastrar</button>
                        <button type="button" onClick={() => navigate("/")} className="btn">Voltar</button>
                    </div>
                </form>
                {themes.length > 0 ? (
                    <ListItems 
                        items={themes}
                        title="Temas cadastrados"
                        removeItem={removeTheme}
                        editItem={editTheme}
                    />
                ) : <span className="span-items">Ainda não há temas cadastrados</span>}
            </div>
        </div>
    )
}
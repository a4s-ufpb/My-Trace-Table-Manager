import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewTheme() {
    const [theme, setTheme] = useState("");
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        const savedThemes = JSON.parse(localStorage.getItem("themes")) || [];

        const lastId = savedThemes.length > 0 ? savedThemes[savedThemes.length - 1].id : 0;
        const newTheme = { id: lastId + 1, name: theme };

        const updatedThemes = [...savedThemes, newTheme];

        localStorage.setItem("themes", JSON.stringify(updatedThemes));

        setTheme("");
        console.log("Temas salvos:", updatedThemes);
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
                        <button type="submit" className="btn-next">Salvar</button>
                        <button type="button" onClick={() => navigate("/")} className="btn-cancel">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
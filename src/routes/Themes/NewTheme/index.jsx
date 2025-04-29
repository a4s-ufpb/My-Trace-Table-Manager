import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useThemeCollection from "../../../hooks/useThemeCollection";
import ListItems from "../../../components/ListItems";
import InvalidPopUp from "../../../components/InvalidPopUp";

export default function NewTheme() {
    const [theme, setTheme] = useState("");
    const [onEdit, setOnEdit] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showInvalidPopUp, setShowInvalidPopUp] = useState(false);
    const { themes, addTheme, editTheme, removeTheme } = useThemeCollection();
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        addTheme(theme);
        setTheme("");
    }

    const handleEdit = (theme) => {
        setEditingId(theme.id);
        setTheme(theme.name);
        setOnEdit(true);
    }

    const saveEdit = () => {
        if (!theme || theme.length < 2) {
            setShowInvalidPopUp(true);
            return;
        }
        editTheme(editingId, { name: theme });
        clear();
    };

    const clear = () => {
        setEditingId(null);
        setTheme("");
        setOnEdit(false);
    }

    return (
        <div className="background">
            <div className="form-bg">
                {onEdit ? <h2>Editar tema</h2> : <h2>Cadastrar novo tema</h2>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="theme">Informe o tema</label>
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
                        {onEdit ? (
                            <>
                                <button type="button" onClick={saveEdit} className="btn">Salvar</button>
                                <button type="button" onClick={clear} className="btn">Cancelar</button>
                            </>
                        ) : (
                            <button type="submit" className="btn">Cadastrar</button>
                        )}
                        <button type="button" onClick={() => navigate("/")} className="btn">Voltar</button>
                    </div>
                </form>
                {themes.length > 0 ? (
                    <ListItems
                        items={themes}
                        title="Temas cadastrados"
                        removeItem={removeTheme}
                        editItem={editTheme}
                        itemType="theme"
                        onEdit={handleEdit}
                    />
                ) : <span className="span-items">Ainda não há temas cadastrados</span>}
            </div>
            {showInvalidPopUp && (
                <InvalidPopUp message="O tema não pode ser vazio ou ter menos de 2 caracteres!" showPopUp={setShowInvalidPopUp}/>
            )}
        </div>
    )
}
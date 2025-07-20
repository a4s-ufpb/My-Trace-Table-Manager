import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useThemeCollection from "../../../hooks/useThemeCollection";
import ListItems from "../../../components/ListItems";
import MessagePopUp from "../../../components/MessagePopUp";
import PageChanging from "../../../components/PageChanging";
import { BsQuestionCircleFill } from "react-icons/bs";
import HelpPopUp from "../../../components/HelpPopUp";

export default function NewTheme() {
    const [theme, setTheme] = useState("");
    const [onEdit, setOnEdit] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState(""); 
    const { themes, addTheme, editTheme, removeTheme, currentPage, totalPages, changePage } = useThemeCollection();
    const [openHelpPopUp, setOpenHelpPopUp] = useState(false);
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        addTheme(theme);
        setPopUpMessage("Tema cadastrado com sucesso!");
        setShowMessagePopUp(true);
        setTheme("");
    }

    const handleEdit = (theme) => {
        setEditingId(theme.id);
        setTheme(theme.name);
        setOnEdit(true);
    }

    const saveEdit = () => {
        if (!theme || theme.length < 2) {
            setPopUpMessage("O tema não pode ser vazio ou ter menos de 2 caracteres!");
            setShowMessagePopUp(true);
            return;
        }
        editTheme(editingId, { name: theme });
        setPopUpMessage("Tema editado com sucesso!");
        setShowMessagePopUp(true);
        clear();
    };

    const clear = () => {
        setEditingId(null);
        setTheme("");
        setOnEdit(false);
    }

    const showHelpPopUp = () => {
        setOpenHelpPopUp(true);
    };

    return (
        <div className="background">
            <div className="form-bg">
                <div className="content-with-help">
                    {onEdit ? <h2>Editar tema</h2> : <h2>Cadastrar novo tema</h2>}
                    <BsQuestionCircleFill className="icon-question" onClick={showHelpPopUp} />
                </div>
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
                        showId={true}
                        editingId={editingId}
                    />
                ) : <span className="span-items">Não há temas!</span>}
                <PageChanging
                    changePage={changePage}
                    currentPage={currentPage}
                    totalPages={totalPages}    
                />
            </div>
            {openHelpPopUp && (
                <HelpPopUp
                    text='Para cadastrar um novo tema, o professor deve informar o nome no campo indicado e clicar no botão "Cadastrar". Caso deseje editar um tema já existente, basta clicar no ícone de lápis ao lado do tema, fazer a alteração desejada e, em seguida, salvar ou cancelar a edição. Para remover um tema, é só clicar no ícone de lixeira correspondente. O número exibido à esquerda de cada tema representa o código identificador do tema. A navegação entre os temas cadastrados pode ser feita pelos botões "Anterior" e "Próximo", localizados na parte inferior da tela.'
                    onClose={() => setOpenHelpPopUp(false)}
                />
            )}
            {showMessagePopUp && (
                <MessagePopUp
                    message={popUpMessage} 
                    showPopUp={setShowMessagePopUp}
                />
            )}
        </div >
    )
}
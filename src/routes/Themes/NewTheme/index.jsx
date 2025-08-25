import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListItems from "../../../components/ListItems";
import MessagePopUp from "../../../components/MessagePopUp";
import PageChanging from "../../../components/PageChanging";
import { BsQuestionCircleFill } from "react-icons/bs";
import HelpPopUp from "../../../components/HelpPopUp";
import { ThemeService } from "../../../service/ThemeService";
import { useUnloadWarning } from "../../../hooks/useUnloadWarning";
import Loading from "../../../components/Loading";

export default function NewTheme() {
    const [theme, setTheme] = useState("");
    const [onEdit, setOnEdit] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState("");
    const [themes, setThemes] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [openHelpPopUp, setOpenHelpPopUp] = useState(false);

    useUnloadWarning(true);

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const themeService = new ThemeService();

    useEffect(() => {
        fetchThemes();
    }, [currentPage]);

    const fetchThemes = async () => {
        setLoading(true);
        try {
            const response = await themeService.findThemesPaginatedByUser(currentPage, 5);
            if (response.success) {
                setThemes(response.data.content || []);
                setTotalPages(response.data.totalPages || 0);
            }
        } catch (error) {
            setPopUpMessage("Erro ao carregar temas. Tente novamente.");
            setShowMessagePopUp(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await themeService.createTheme(theme);
        if (response.success) {
            setPopUpMessage("Tema cadastrado com sucesso!");
            setShowMessagePopUp(true);
            setTheme("");
            fetchThemes();
        } else {
            setPopUpMessage(response.message || "Erro ao cadastrar tema.");
            setShowMessagePopUp(true);
        }
    }

    const handleEdit = (theme) => {
        setEditingId(theme.id);
        setTheme(theme.name);
        setOnEdit(true);
    }

    const saveEdit = async () => {
        if (!theme || theme.length < 2) {
            setPopUpMessage("O tema não pode ser vazio ou ter menos de 2 caracteres!");
            setShowMessagePopUp(true);
            return;
        }

        const response = await themeService.updateTheme(editingId, { name: theme });
        if (response.success) {
            setPopUpMessage("Tema editado com sucesso!");
            setShowMessagePopUp(true);
            clear();
            fetchThemes();
        } else {
            setPopUpMessage(response.message || "Erro ao editar tema.");
            setShowMessagePopUp(true);
        }
    };

    const removeTheme = async (id) => {
        const response = await themeService.deleteTheme(id);
        if (response.success) {
            setPopUpMessage("Tema removido com sucesso!");
            setShowMessagePopUp(true);
            fetchThemes();
        } else {
            setPopUpMessage("Erro ao remover tema.");
            setShowMessagePopUp(true);
        }
    };

    const clear = () => {
        setEditingId(null);
        setTheme("");
        setOnEdit(false);
    }

    const changePage = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const showHelpPopUp = () => {
        setOpenHelpPopUp(true);
    };

    return (
        <div className="background">
            <div className="form-bg">
                <div className="content-with-help">
                    {onEdit ? <h2>Editar tema</h2> : <h2>Cadastrar novo tema</h2>}
                    <span data-testid="help-icon" onClick={showHelpPopUp} style={{ cursor: 'pointer' }}>
                        <BsQuestionCircleFill className="icon-question" />
                    </span>
                </div>
                <form onSubmit={handleSubmit} data-testid="theme-form">
                    <div>
                        <label htmlFor="theme">Informe o tema</label>
                        <input
                            className="form-input"
                            type="text"
                            name="theme"
                            id="theme"
                            minLength="2"
                            maxLength="30"
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            required
                            data-testid="theme-name-input"
                        />
                    </div>
                    <div className="btn-container">
                        {onEdit ? (
                            <>
                                <button type="button" onClick={saveEdit} className="btn" data-testid="save-edit-button">Salvar</button>
                                <button type="button" onClick={clear} className="btn" data-testid="cancel-edit-button">Cancelar</button>
                            </>
                        ) : (
                            <button type="submit" className="btn" data-testid="register-button">Cadastrar</button>
                        )}
                        <button type="button" onClick={() => navigate(-1)} className="btn">Voltar</button>
                    </div>
                </form>
                {loading ? (
                    <Loading />
                ) : themes.length > 0 ? (
                    <ListItems
                        items={themes}
                        title="Temas cadastrados"
                        removeItem={removeTheme}
                        itemType="theme"
                        onEdit={handleEdit}
                        showId={true}
                        editingId={editingId}
                    />
                ) : (
                    <span className="span-items" data-testid="no-themes-message">Não há temas!</span>
                )}

                {!loading && totalPages > 0 && (
                    <PageChanging
                        changePage={changePage}
                        currentPage={currentPage}
                        totalPages={totalPages}
                    />
                )}
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
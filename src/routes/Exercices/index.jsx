import { useEffect, useState } from "react";
import ListExercises from "../../components/ListExercises";
import styles from "./styles.module.css";
import PageChanging from "../../components/PageChanging";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeService } from "../../service/ThemeService";
import { TraceTableService } from "../../service/TraceTableService";
import MessagePopUp from "../../components/MessagePopUp";
import Loading from "../../components/Loading";

export default function Exercises() {

    const [traceTables, setTraceTables] = useState([]);
    const [themesMap, setThemesMap] = useState({});
    const [allThemes, setAllThemes] = useState([]);
    const [filteredTheme, setFilteredTheme] = useState({ id: null, name: "todos" });

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState("");

    const themeService = new ThemeService();
    const traceTableService = new TraceTableService();

    useEffect(() => {
        if (location.state?.refresh) {
            loadTraceTables();
            navigate(location.pathname, { replace: true });
        }
    }, [location]);

    const loadThemes = async () => {
        const response = await themeService.findAllThemesByUser();
        if (response.success) {
            setAllThemes(response.data.content || []);
        }
    };

    const loadThemesPerExercise = async () => {
        const newMap = {};

        for (const trace of traceTables) {
            const response = await themeService.getThemesByExercise(trace.id);
            if (response.success) {
                const nomes = response.data.content.map(t => t.name);
                newMap[trace.id] = nomes;
            }
        }

        setThemesMap(newMap);
    };

    const loadTraceTables = async () => {
        setLoading(true);
        try {
            const userId = localStorage.getItem("userId");

            let response;
            if (filteredTheme.name === "todos") {
                response = await traceTableService.getAllByUser(userId, currentPage);
            } else {
                response = await traceTableService.getAllByTheme(filteredTheme.id, currentPage);
            }

            if (response.success) {
                setTraceTables(response.data.content || []);
                setTotalPages(response.data.totalPages || 0);
            }
        } catch (error) {
            setPopUpMessage("Erro ao carregar os exercícios. Tente novamente.");
            setShowMessagePopUp(true);
        } finally {
            setLoading(false);
        }
    };

    const removeTraceTable = async (id) => {
        const response = await traceTableService.deleteTraceTable(id);
        if (response.success) {
            setPopUpMessage("Exercício removido com sucesso!");
            const updated = traceTables.filter(trace => trace.id !== id);
            setTraceTables(updated);

            if (updated.length === 0 && currentPage > 0) {
                setCurrentPage(currentPage - 1);
            } else {
                loadTraceTables();
            }
        } else {
            setPopUpMessage(response.message || "Erro ao remover exercício");
        }
        setShowMessagePopUp(true);
    };

    const setFilteredThemeAndResetPage = (theme) => {
        setFilteredTheme(theme);
        setCurrentPage(0);
    };

    const changePage = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    useEffect(() => {
        loadThemes();
    }, []);

    useEffect(() => {
        loadTraceTables();
    }, [currentPage, filteredTheme]);

    useEffect(() => {
        if (traceTables.length > 0) {
            loadThemesPerExercise();
        }
    }, [traceTables]);

    return (
        <div className="background">
            <nav className={styles.nav}>
                <ul>
                    <li><button
                        onClick={() => setFilteredThemeAndResetPage({ id: null, name: "todos" })}
                        className={`${styles.button} ${filteredTheme.name === "todos" ? styles.active : ""}`}
                    >Todos</button>
                    </li>
                    {allThemes.length > 0 &&
                        allThemes.map((theme) => (
                            <li key={theme.id}>
                                <button
                                    onClick={() => setFilteredThemeAndResetPage(theme)}
                                    className={`${styles.button} ${filteredTheme.name === theme.name ? styles.active : ""}`}
                                >{theme.name}</button>
                            </li>
                        ))
                    }
                </ul>
            </nav>
            {loading ? (
                <Loading />
            ) : traceTables.length > 0 ? (
                <ListExercises
                    exercises={traceTables}
                    themesMap={themesMap}
                    removeExercise={removeTraceTable}
                />
            ) : (
                <span className={styles.span}>Nenhum exercício foi encontrado!</span>
            )}
            {showMessagePopUp && (
                <MessagePopUp
                    message={popUpMessage}
                    showPopUp={setShowMessagePopUp}
                />
            )}
            {!loading && traceTables.length > 0 && (
                <PageChanging
                    currentPage={currentPage}
                    totalPages={totalPages}
                    changePage={changePage}
                />
            )}

            {!loading && (
                <button className="btn" onClick={() => navigate("/")}>
                    Voltar
                </button>
            )}
        </div>
    );

}
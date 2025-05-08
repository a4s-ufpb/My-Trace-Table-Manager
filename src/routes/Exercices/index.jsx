import { useEffect, useState } from "react";
import ListExercises from "../../components/ListExercises";
import useTraceTableCollection from "../../hooks/useTraceTableCollection";
import useThemeCollection from "../../hooks/useThemeCollection";
import styles from "./styles.module.css";
import PageChanging from "../../components/PageChanging";
import { useNavigate } from "react-router-dom";

export default function Exercises() {

    const { traceTables, removeTraceTable, changePage, currentPage, totalPages, filteredTheme, setFilteredThemeAndResetPage } = useTraceTableCollection();
    const { allThemes, getThemesByExercise } = useThemeCollection();
    const [themesMap, setThemesMap] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchThemes = async () => {
            const data = {};
            for (const trace of traceTables) {
                const themes = await getThemesByExercise(trace.id);
                data[trace.id] = themes.map(theme => theme.name);
            }
            setThemesMap(data);
        };
        if (traceTables.length > 0) {
            fetchThemes();
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
            <ListExercises
                exercises={traceTables}
                themesMap={themesMap}
                removeExercise={removeTraceTable}
            />
            {traceTables.length > 0 ? (
                <PageChanging
                    currentPage={currentPage}
                    totalPages={totalPages}
                    changePage={changePage}
                />) : <span className={styles.span}>Nenhum exercício foi encontrado!</span>}
            <button className="btn" onClick={() => navigate("/")}>
                Voltar
            </button>
        </div>
    );

}
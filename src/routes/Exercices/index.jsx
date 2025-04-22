import { useEffect, useState } from "react";
import ListExercises from "../../components/ListExercises";
import useTraceTableCollection from "../../hooks/useTraceTableCollection";
import useThemeCollection from "../../hooks/useThemeCollection";
import styles from "./styles.module.css";

export default function Exercises() {

    const [filteredTheme, setFilteredTheme] = useState("todos");
    const { traceTables, editTraceTable, removeTraceTable } = useTraceTableCollection();
    const { themes, getThemesByExercise } = useThemeCollection();
    const [themesMap, setThemesMap] = useState({});

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

    const filteredExercises = traceTables.filter(trace => {
        if (filteredTheme === "todos") return true;
        const themeNames = themesMap[trace.id] || [];
        return themeNames.includes(filteredTheme);
    });

    return (
        <div className="background">
            <nav className={styles.nav}>
                <ul>
                    <li><button
                        onClick={() => setFilteredTheme("todos")}
                        className={`${styles.button} ${filteredTheme === "todos" ? styles.active : ""}`}
                    >Todos</button>
                    </li>
                    {themes.length > 0 &&
                        themes.map((theme) => (
                            <li key={theme.id}>
                                <button
                                    onClick={() => setFilteredTheme(theme.name)}
                                    className={`${styles.button} ${filteredTheme === theme.name ? styles.active : ""}`}
                                >{theme.name}</button>
                            </li>
                        ))
                    }
                </ul>
            </nav>
            <ListExercises
                exercises={filteredExercises}
                themesMap={themesMap}
                removeExercise={removeTraceTable}
                editExercise={editTraceTable}
            />
        </div>
    );

}
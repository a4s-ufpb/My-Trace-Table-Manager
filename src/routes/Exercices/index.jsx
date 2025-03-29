import { useState } from "react";
import ListExercises from "../../components/ListExercises";
import useTraceTableCollection from "../../hooks/useTraceTableCollection";
import useThemeCollection from "../../hooks/useThemeCollection";
import styles from "./styles.module.css";

export default function Exercises() {

    const [filteredTheme, setFilteredTheme] = useState("todos");
    const { traceTables, removeTraceTable } = useTraceTableCollection();
    const { themes } = useThemeCollection();

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
                exercises={traceTables.filter(ex =>
                    filteredTheme === "todos" || ex.themes.includes(filteredTheme)
                )}
                removeExercise={removeTraceTable}
            />
        </div>
    );

}
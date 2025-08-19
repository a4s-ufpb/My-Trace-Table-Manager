import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import styles from "./styles.module.css"

export default function Home() {
    const navigate = useNavigate();
    const role = localStorage.getItem("userRole") || "user";

    return (
        <div className={styles.home}>
            {role === "admin" &&
                <Button text="Cadastrar/Ver Professor(es)" action={() => navigate("new-professor")} />
            }
            <Button text="Cadastrar Exercício" action={() => navigate("new-exercise")} data-testid="home-new-exercise-button" />
            <Button text="Ver exercícios" action={() => navigate("list-exercises")} />
            <Button text="Cadastrar/Ver Tema(s)" action={() => navigate("new-theme")} />
            <Button text="Ajuda" action={() => navigate("help-page")} />
            <Button text="Sobre" action={() => navigate("about")} />
        </div>
    )
}
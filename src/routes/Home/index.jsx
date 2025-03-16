import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import styles from "./styles.module.css"

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="background">
            <div className={styles.home}>
                <Button text="Cadastrar Exercício" action={() => navigate("/newexercice")} />
                {/* <Button text="Listar exercícios" action={() => navigate("/listexercices")} /> */}
                <Button text="Sobre" action={() => navigate("/about")} />
                <Button text="Cadastrar Tema" action={() => navigate("new-theme")} />
                <Button text="Ajuda" action={() => navigate("/help-page")} />
            </div>
        </div>
    )
}
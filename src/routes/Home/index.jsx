import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="background">
            <Button text="Cadastrar exercício" action={() => navigate("/newexercice")}/>
            <Button text="Sobre" action={() => navigate("/about")}/>
        </div>
    )
}
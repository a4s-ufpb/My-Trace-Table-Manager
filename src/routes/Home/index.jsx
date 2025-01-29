import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="background">
            <Button text="Professores" action={() => navigate("/professor")}/>
            <Button text="Sobre" action={() => navigate("/about")}/>
        </div>
    )
}
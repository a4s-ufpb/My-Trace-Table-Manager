import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

export default function Professor() {
    const navigate = useNavigate()

    return (
        <div className="background">
            <Button text="Ayla" action={() => navigate("/exercices/Ayla")} />
            <Button text="Vanessa" action={() => navigate("/exercices/Vanessa")} />
            <Button text="Ana Liz" action={() => navigate("/exercices/AnaLiz")} />
            <Button text="Raquel" action={() => navigate("/exercices/Raquel")} />
        </div>
    )
}
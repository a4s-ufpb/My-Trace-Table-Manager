import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/Button";

export default function Exercices() {
    const navigate = useNavigate()
    const { professorId } = useParams()

    return (
        <div className="background">
            <h1>Exercícios do(a) Professor(a): {professorId}</h1>
            <Button text="Listas" action={() => navigate(`/exercices/${professorId}/lists`)}/>
        </div>
    )
}
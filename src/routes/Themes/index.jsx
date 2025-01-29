import { useParams } from "react-router-dom";

export default function Themes() {
    const { professorId } = useParams();

    return (
        <div className="background">
            <h1 className="title">Exercícios do(a) Professor(a): {professorId}</h1>

        </div>
    )
}
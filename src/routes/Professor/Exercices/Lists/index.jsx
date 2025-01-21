import { useParams } from "react-router-dom";

export default function Lists() {
    const { professorId } = useParams();

    return (
        <div className="background">
            <h1>Listas do Professor: {professorId}</h1>
        </div>
    );
}
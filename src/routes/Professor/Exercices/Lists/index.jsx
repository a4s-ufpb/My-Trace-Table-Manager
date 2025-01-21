import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import listData from "../../../../data/lists/lists.json";
import Button from "../../../../components/Button";

export default function Lists() {
    const navigate = useNavigate();
    const { professorId } = useParams();

    function navigateForTraceTable(exercice, exerciceId) {
        localStorage.setItem("exercice", JSON.stringify(exercice));
        navigate(`/exercices/${professorId}/lists/${exerciceId}`);
    }

    return (
        <div className="background">
            <h1 className="title">Listas de {professorId}</h1>
            <div className="container-data">
                {listData &&
                listData.length > 0 &&
                listData.map((exercice) => (
                    <div key={exercice.id}>
                        <Button
                            text={`Exercício ${exercice.id}`}
                            action={() => navigateForTraceTable(exercice, exercice.id)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

//classe falta ser alterada
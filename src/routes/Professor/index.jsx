import { useNavigate, useOutletContext } from "react-router-dom";
import Button from "../../components/Button";

export default function Professor() {
    const navigate = useNavigate()
    const { professors } = useOutletContext()

    return (
        <div className="background">
            <h1 className="title">Professores</h1>
            {professors.map((professor) => (
                <Button
                    key={professor.id}
                    text={professor.name}
                    action={() => navigate(`/themes/${professor.name}`)}
                />
            ))}
            <div>
                <Button 
                    text="Cadastrar novo professor"
                    action={() => navigate("/professor/new")}
                />
            </div>
        </div>
    )
}
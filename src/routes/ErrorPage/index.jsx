import { useRouteError, Link } from "react-router-dom";
import Header from "../../components/Header";

export default function ErrorPage() {
    const error = useRouteError();
    console.error("Erro capturado:", error);

    return (
        <div>
            <Header />
            <div className="background">
                <h1>Ops! Algo deu errado.</h1>
                <p>{error.statusText || error.message}</p>
            </div>
        </div>
    );
}
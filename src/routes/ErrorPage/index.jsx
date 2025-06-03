import { useRouteError, Link } from "react-router-dom";
import Header from "../../components/Header";

export default function ErrorPage() {
    const error = useRouteError();
    console.error("Erro capturado:", error);

    return (
        <div>
            <Header />
            <div className="background" style={{ textAlign: 'center' }}>
                <h2 style={{ marginBottom: '5px' }}>Ops! Algo deu errado.</h2>
                <p>{error.statusText || error.message}</p>
            </div>
        </div>
    );
}
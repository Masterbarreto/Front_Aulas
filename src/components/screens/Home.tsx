import { Hub } from "../ui/hub";
import "../../Styles/homePage.css";
import { AnoCard } from "../ui/AnoCard";
import { useNavigate } from "react-router-dom";

export function HomePage() {
    const navigate = useNavigate();
    return (
        <div className="home-container">
            <Hub />
            <div className="container-título">
                {/* Título principal */}
                <div className="header-container">
                    <h1>Bem-vindo, Professor(a)!</h1>
                </div>

                {/* Container do subtítulo e cartões */}
                <div className="container-icone">
                    <p className="text-curos">Seus Cursos</p>
                    <div className="anos-container">
                        <div onClick={() => navigate("/1ano")}>
                            <AnoCard titulo="1º Ano" />
                        </div>
                        <div onClick={() => navigate("/2ano")}>
                            <AnoCard titulo="2º Ano" />
                        </div>
                        <div onClick={() => navigate("/3ano")}>
                            <AnoCard titulo="3º Ano" />
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

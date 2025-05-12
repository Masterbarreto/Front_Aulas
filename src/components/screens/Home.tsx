import { Hub } from "../ui/hub";
import "../../Styles/homePage.css";
import { GraduationCap } from "lucide-react";

export function HomePage() {
    return (
        <div style={{ display: "flex", height: "100vh", backgroundColor: "#0e1117" }}>
            <Hub />
            <div className="container-principal">
                {/* Container para o título */}
                <div className="header-container">
                    <h1>Bem-vindo, Professor(a)!</h1>
                </div>

                {/* Container para o restante do conteúdo */}

            </div>
        </div>
    );
}

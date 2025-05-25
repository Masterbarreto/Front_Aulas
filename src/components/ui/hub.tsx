import { HubItens } from "./hub_itens";
import { LayoutDashboard, ArrowUpToLine, SquareLibrary, Building2, Bolt, Power } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Importa o hook useNavigate
import "../../Styles/hub.css";

export function Hub() {
    const navigate = useNavigate();
    const cargo = localStorage.getItem("cargo");

    return (
        <div className="sidebar">
            <div className="container-hub">
                {/* Dashboard: todos podem ver */}
                {(cargo === "admin" || cargo === "Professor") && (
                    <div onClick={() => navigate("/home")}>
                        <HubItens icon={<LayoutDashboard size={24} />} text="Dashboard" />
                    </div>
                )}
                {/* Upload: apenas admin e Professor */}
                {(cargo === "admin") && (
                    <div onClick={() => navigate("/upload")}>
                        <HubItens icon={<ArrowUpToLine size={24} />} text="Upload de Atividades" />
                    </div>
                )}
                {/* Gerenciar: apenas admin */}
                {cargo === "admin" && (
                    <div onClick={() => navigate("/manage")}>
                        <HubItens icon={<SquareLibrary size={24} />} text="Gerenciar Atividades" />
                    </div>
                )}
                {/* Relatório: admin e Professor */}
                {(cargo === "admin" || cargo === "Professor") && (
                    <div onClick={() => navigate("/RelatorioAulas")}>
                        <HubItens icon={<Building2 size={24} />} text="Relatório de Aulas Concluídas" />
                    </div>
                )}
            </div>
            <div className="container-config">
                <div onClick={() => navigate("/settings")}>
                    <HubItens icon={<Bolt size={24} />} text="Configurações" />
                </div>
                <div onClick={() => navigate("/")}>
                    <HubItens icon={<Power size={24} />} text="Sair" />
                </div>
            </div>
        </div>
    );
}

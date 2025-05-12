import { HubItens } from "./hub_itens";
import { LayoutDashboard, ArrowUpToLine, SquareLibrary, Building2, Bolt, Power } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Importa o hook useNavigate
import "../../Styles/hub.css";

export function Hub() {
    const navigate = useNavigate(); // Inicializa o hook useNavigate

    return (
        <div className="sidebar">
            <div className="container-hub">
                <div onClick={() => navigate("/dashboard")}>
                    <HubItens icon={<LayoutDashboard size={24} />} text="Dashboard" />
                </div>
                <div onClick={() => navigate("/upload")}>
                    <HubItens icon={<ArrowUpToLine size={24} />} text="Upload de Atividades" />
                </div>
                <div onClick={() => navigate("/manage")}>
                    <HubItens icon={<SquareLibrary size={24} />} text="Gerenciar Atividades" />
                </div>
                <div onClick={() => navigate("/report")}>
                    <HubItens icon={<Building2 size={24} />} text="Relatório de Aulas Concluídas" />
                </div>
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

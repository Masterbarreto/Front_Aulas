import { HubItens } from "./hub_itens";
import { LayoutDashboard, ArrowUpToLine, SquareLibrary, Building2, Bolt, Power } from "lucide-react";
import "../../Styles/hub.css";

export function Hub() {
    return (
        <div className="sidebar">
            <div className="container-hub">
                <HubItens icon={<LayoutDashboard size={24} />} text="Dashboard"  />
                <HubItens icon={<ArrowUpToLine size={24} />} text="Upload de Atividades" />
                <HubItens icon={<SquareLibrary size={24} />} text="Gerenciar Atividades"  />
                <HubItens icon={<Building2 size={24} />} text="Relatório de Aulas Concluídas"  />
            </div>
            <div className="container-config">
                <HubItens icon={<Bolt size={24} />} text="Configurações"  />
                <HubItens icon={<Power size={24} />} text="Sair"  />
            </div>
        </div>
    );
}

import React, { useState, useEffect } from "react";
import { HubItens } from "./hub_itens";
import { LayoutDashboard, ArrowUpToLine, SquareLibrary, Building2, Users , Power } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../Styles/hub.css";

export function Hub() {
    const navigate = useNavigate();
    const [cargo, setCargo] = useState<string | null>(null);

    useEffect(() => {
        // Tentar ler o cargo do usuário do localStorage
        const storedCargo = localStorage.getItem("cargo");
        if (storedCargo) {
            setCargo(storedCargo);
        } else {
            // Se não houver cargo no localStorage, definir como "Professor"
            localStorage.setItem("cargo", "Professor");
            setCargo("Professor");
        }
    }, []);

    // Verifica se o usuário é admin ou Professor
    const isPrivileged = cargo === "admin" || cargo === "Professor";

    console.log("Cargo do usuário:", cargo);

    return (
        <div className="sidebar">
            <div className="container-hub">
                {/* Dashboard: apenas admin ou Professor */}
                {isPrivileged && (
                    <div onClick={() => navigate("/home")}>
                        <HubItens icon={<LayoutDashboard size={24} />} text="Dashboard" />
                    </div>
                )}

                {/* Upload e Gerenciar: apenas admin */}
                {cargo === "admin" && (
                    <>
                        <div onClick={() => navigate("/upload")}>
                            <HubItens icon={<ArrowUpToLine size={24} />} text="Upload de Atividades" />
                        </div>
                        <div onClick={() => navigate("/editar-aula")}>
                            <HubItens icon={<SquareLibrary size={24} />} text="Gerenciar Atividades" />
                        </div>
                    </>
                )}

                {/* Relatório: apenas admin ou Professor */}
                {isPrivileged && (
                    <div onClick={() => navigate("/relatorio-aulas")}>
                        <HubItens icon={<Building2 size={24} />} text="Relatório de Aulas Concluídas" />
                    </div>
                )}
            </div>

            <div className="container-config">
                {/* Configurações e Sair: apenas para usuários logados */}
                {cargo && (
                    <>
                        {cargo !== "admin" && (
                            <div onClick={() => navigate("/login")}>
                                <HubItens icon={<Users size={24} />} text=" Login Adiministrativo" />
                            </div>
                        )}
                        <div
                            onClick={() => {
                                try {
                                    // Limpa todo o localStorage
                                    localStorage.clear();
                                    console.log("LocalStorage limpo com sucesso.");

                                    // Redefine o estado para "Professor"
                                    setCargo("Professor");
                                    console.log("Estado 'cargo' redefinido para 'Professor'.");

                                    // Redireciona para a página inicial
                                    navigate("/");
                                    console.log("Redirecionado para a página inicial.");
                                } catch (error) {
                                    console.error("Erro ao tentar sair:", error);
                                }
                            }}
                        >
                            <HubItens icon={<Power size={24} />} text="Sair" />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

import React from "react";

function formatarData(dataString: string) {
    if (!dataString) return "";
    const data = new Date(dataString);
    if (isNaN(data.getTime())) return ""; // se for inválido
    return data.toLocaleDateString('pt-BR');
}

interface AulaRelatorioRowProps {
    aula: any;
    data: string;
    onClick: (aula: any) => void;
    idx: number;
}

export function AulaRelatorioRow({ aula, data, onClick, idx }: AulaRelatorioRowProps) {
    const dataSomente = data.split(" ")[0];

    return (
        <tr key={aula.id || idx} onClick={() => onClick(aula)} className="relatorio-row">
            <td>{aula.titulo || aula.título || ""}</td>
            <td>Concluída</td>
            <td>{dataSomente}</td>
            <td>{aula.professor}</td>
        </tr>
    );
}
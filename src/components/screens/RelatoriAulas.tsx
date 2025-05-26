import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hub } from '../ui/hub';
import { AulaRelatorioRow } from "../ui/AulaRelatorioRow";
import "../../Styles/RelatorioAulas.css";

export default function RelatorioAulas() {
    const [aulas, setAulas] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("https://apisubaulas.onrender.com/api/v1/aulas/AulasConcluidas")
            .then(res => res.json())
            .then(data => setAulas(Array.isArray(data) ? data : []))
            .catch(() => setAulas([]));
    }, []);

    const handleRowClick = (aula: any) => {
        const { anoEscolar, curso, Turma, Materia, aulaId, _id } = aula;
        const id = aulaId || _id;
        if (!id) return; // não navega se não houver id
        navigate(`/${anoEscolar}/${curso}/${Turma}/${Materia}/aulas/${id}`);
    };

    function formatarData(dataString: string) {
        if (!dataString) return "";
        // Se vier no formato "dd/mm/yyyy hh:mm", pega só a data
        if (dataString.includes("/")) return dataString.split(" ")[0];
        // Se vier ISO, formata
        const data = new Date(dataString);
        if (isNaN(data.getTime())) return "";
        return data.toLocaleDateString('pt-BR');
    }

    return (
        <>
            <Hub />
            <div className="container-relatorio">
                <h1>Relatório de Aulas Concluídas</h1>
                <div className="Container-AulasRelatorio">
                    <table className="relatorio-tabela">
                        <thead>
                            <tr>
                                <th>Aula</th>
                                <th>Status</th>
                                <th>Data</th>
                                <th>Professor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {aulas.map((aula, idx) => (
                                <AulaRelatorioRow
                                    key={aula.id || idx}
                                    aula={aula}
                                    data={formatarData(aula.DayAula || aula.dataAula || aula.data)}
                                    idx={idx}
                                    onClick={handleRowClick}
                                    onToggleConcluir={() => handleToggleConcluirAula(aula)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
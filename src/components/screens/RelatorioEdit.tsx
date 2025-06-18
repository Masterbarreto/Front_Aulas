import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hub } from '../ui/hub';
import "../../Styles/EditarAula.css";
import Dashboard from '../ui/graficos/Graficos';

export default function RelatorioEdit() {
    const [aulas, setAulas] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Busca dados de ambas as APIs
        Promise.all([
            fetch("https://apisubaulas.onrender.com/api/v1/aulas/AulasConcluidas").then(res => res.json()),
            fetch("https://apisubaulas.onrender.com/api/v1/aulas/MostarAulas").then(res => res.json())
        ])
            .then(([concluidas, todas]) => {
                // Normaliza os dados de ambas as APIs
                const aulasConcluidas = concluidas.map((aula: any) => ({
                    id: aula._id,
                    titulo: aula.titulo || "Sem título",
                    data: aula.DayAula || "Sem data",
                    professor: aula.professor || "Desconhecido",
                    status: aula.concluida ? "Concluída" : "Não Concluída",
                    anoEscolar: aula.anoEscolar,
                    curso: aula.curso,
                    turma: aula.Turma,
                    materia: aula.Materia,
                }));

                const aulasNaoConcluidas = todas.map((aula: any) => ({
                    id: aula.aulaId,
                    titulo: aula.titulo || "Sem título",
                    data: aula.DayAula || "Sem data",
                    professor: aula.professor || "Não informado",
                    status: aula.concluida ? "Concluída" : "Não Concluída",
                    anoEscolar: aula.anoEscolar,
                    curso: aula.curso,
                    turma: aula.Turma,
                    materia: aula.Materia,
                }));

                // Combina os dados normalizados
                const aulasCompletas = [...aulasConcluidas, ...aulasNaoConcluidas];
                setAulas(aulasCompletas);
            })
            .catch(() => setAulas([]));
    }, []);

    const handleRowClick = (aula: any) => {
        const { id } = aula;
        if (!id) return;
        navigate(`/editar-aula/${id}`);
    };

    const handleDeleteAula = async (id: string) => {
        console.log("ID da aula para exclusão:", id);
        if (!id) return;

        const confirmDelete = window.confirm("Tem certeza que deseja excluir esta aula?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`https://apisubaulas.onrender.com/api/v1/aulas/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error(`Erro ao excluir aula: ${response.statusText}`);
            }
            alert("Aula excluída com sucesso!");
            setAulas((prevAulas) => prevAulas.filter((aula) => aula.id !== id));
        } catch (error) {
            console.error(error);
            alert("Erro ao excluir aula.");
        }
    };

    return (
        <>
            <Hub />
            <div className="container-relatorio">
                <h1>Relatório de Aulas</h1>
                <div className="container-graficos">
                    <Dashboard />
                </div>
                {/* Tabela de Todas as Aulas */}
                <div className="Container-AulasRelatorio">
                    <table className="relatorio-tabela">
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Status</th>
                                <th>Data</th>
                                <th>Professor</th>
                                <th>Ano Escolar</th>
                                <th>Curso</th>
                                <th>Turma</th>
                                <th>Matéria</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {aulas.map((aula, idx) => (
                                <tr
                                    key={aula.id || idx}
                                    className="relatorio-row"
                                    onClick={() => handleRowClick(aula)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td>{aula.titulo}</td>
                                    <td>{aula.status}</td>
                                    <td>{aula.data}</td>
                                    <td>{aula.professor}</td>
                                    <td>{aula.anoEscolar}</td>
                                    <td>{aula.curso}</td>
                                    <td>{aula.turma}</td>
                                    <td>{aula.materia}</td>
                                    <td>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteAula(aula.id);
                                            }}
                                            style={{
                                                backgroundColor: "red",
                                                color: "white",
                                                border: "none",
                                                padding: "5px 10px",
                                                cursor: "pointer",
                                                borderRadius: "4px"
                                            }}
                                        >
                                            Deletar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
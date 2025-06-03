import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Hub } from "../ui/hub"; // Certifique-se de que o caminho está correto
import "../../Styles/EditarAulas.css";

const API_URL = "https://apisubaulas.onrender.com/api/v1/aulas";

export default function EditarAula() {
    const { id } = useParams(); // Pega o ID da aula da URL
    const navigate = useNavigate();
    const [aula, setAula] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Busca os dados da aula pelo ID
    useEffect(() => {
        if (!id) return;
        axios
            .get(`${API_URL}/aula-id/${id}`)
            .then((response) => {
                setAula(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Erro ao carregar os dados da aula.");
                setLoading(false);
            });
    }, [id]);

    // Atualiza os campos da aula
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAula((prev: any) => ({ ...prev, [name]: value }));
    };

    // Envia as alterações para o backend
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(aula); // Verifica os dados antes de enviar
        try {
            await axios.patch(`${API_URL}/${id}`, aula);
            alert("Aula editada com sucesso!");
            navigate(-1); // Volta para a página anterior
        } catch (err) {
            console.error(err);
            alert("Erro ao editar a aula.");
        }
    };

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container-editar-aula">
            <Hub /> {/* Adicionado o Hub no topo */}
            <h1>Editar Aula</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="titulo">Título</label>
                    <input
                        type="text"
                        id="titulo"
                        name="titulo"
                        value={aula?.titulo || ""}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="curso">Curso</label>
                    <input
                        type="text"
                        id="curso"
                        name="curso"
                        value={aula?.curso || ""}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="Turma">Turma</label>
                    <input
                        type="text"
                        id="Turma"
                        name="Turma"
                        value={aula?.Turma || ""}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="Materia">Matéria</label>
                    <input
                        type="text"
                        id="Materia"
                        name="Materia"
                        value={aula?.Materia || ""}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="DayAula">Data da Aula</label>
                    <input
                        type="date"
                        id="DayAula"
                        name="DayAula"
                        value={aula?.DayAula || ""}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="Horario">Horário</label>
                    <input
                        type="time"
                        id="Horario"
                        name="Horario"
                        value={aula?.Horario || ""}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="DesAula">Descrição</label>
                    <textarea
                        id="DesAula"
                        name="DesAula"
                        value={aula?.DesAula || ""}
                        onChange={handleChange}
                    />
                </div>
                <div className="button-container">
                    <button type="submit" className="btn-editar-aulas">
                        Salvar Alterações
                    </button>
                    <button type="button" className="btn-voltar" onClick={() => navigate(-1)}>
                        Voltar
                    </button>
                </div>
            </form>
        </div>
    );
}
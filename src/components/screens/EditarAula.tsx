import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Hub } from "../ui/hub";
import "../../Styles/EditarAulas.css";
import { LinkModal } from "../ui/LinkModal";
import { FileUploader } from "../ui/FileUploader";

const API_URL = "https://apisubaulas.onrender.com/api/v1/aulas";

export default function EditarAula() {
    const { id } = useParams(); // Pega o ID da aula da URL
    const navigate = useNavigate();
    const [aula, setAula] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [links, setLinks] = useState<any[]>([]); // Links atuais
    const [structuredLinks, setStructuredLinks] = useState<any[]>([]); // Links estruturados
    const [files, setFiles] = useState<File[]>([]); // Novos arquivos selecionados
    const [existingFiles, setExistingFiles] = useState<any[]>([]); // Arquivos que já estavam salvos
    const linkModalRef = useRef<any>(null);

    // Busca os dados da aula pelo ID e popula estados
    useEffect(() => {
        if (!id) return;
        axios
            .get(`${API_URL}/aula-id/${id}`)
            .then((response) => {
                setAula(response.data);
                setLinks(response.data.LinkAula || []);
                setStructuredLinks(response.data.LinkAula || []);
                setExistingFiles(response.data.arquivos || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erro ao carregar aula:", err);
                setError("Erro ao carregar os dados da aula.");
                setLoading(false);
            });
    }, [id]);

    // Atualiza valores textuais
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAula((prev: any) => ({ ...prev, [name]: value }));
    };

    // Atualiza os links estruturados
    const handleStructuredLinksChange = (newLinks: any[]) => {
        setStructuredLinks(newLinks);
        const linkData = newLinks.map((link) => ({ url: link.url, name: link.name }));
        setLinks(linkData);
    };

    // Remove um arquivo existente
    const handleRemoveFile = (index: number) => {
        const updatedFiles = [...existingFiles];
        updatedFiles.splice(index, 1);
        setExistingFiles(updatedFiles);
    };

    // Envia tudo (texto + links + arquivos novos) num único PATCH
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();

        // Campos de texto
        formData.append("titulo", aula.titulo || "");
        formData.append("curso", aula.curso || "");
        formData.append("Turma", aula.Turma || "");
        formData.append("Materia", aula.Materia || "");
        formData.append("DayAula", aula.DayAula || "");
        formData.append("Horario", aula.Horario || "");
        formData.append("DesAula", aula.DesAula || "");

        // Links estruturados como JSON
        try {
            formData.append("LinkAula", JSON.stringify(links));
        } catch (err) {
            console.error("Erro ao converter links para JSON:", err);
            alert("Erro ao processar os links. Verifique o console.");
            return;
        }

        // IDs dos arquivos que você decidiu manter
        const existingIds = existingFiles.map((f) => f._id || f.id || f.nome);
        formData.append("arquivosExistentes", JSON.stringify(existingIds));

        // Novos arquivos
        files.forEach((file) => {
            formData.append("arquivos", file);
        });

        try {
            const response = await axios.patch(`${API_URL}/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // Atualiza os estados com os dados retornados pelo backend
            setAula(response.data.aula);
            setLinks(response.data.aula.LinkAula || []);
            setExistingFiles(response.data.aula.arquivos || []);

            alert("Aula editada com sucesso!");
        } catch (err: any) {
            console.error("Erro ao enviar os dados:", err.response?.data || err);
            alert("Erro ao editar a aula: " + (err.response?.data?.message || "Verifique o console."));
        }
    };

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container-editar-aula">
            <Hub />
            <h1>Editar Aula</h1>
            <form onSubmit={handleSubmit}>
                {/* Campos de texto */}
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
                {/* Links */}
                <div className="form-group">
                    <label>Links</label>
                    <LinkModal ref={linkModalRef} onLinksChange={handleStructuredLinksChange} initialLinks={structuredLinks} />
                </div>
                {/* Arquivos */}
                <div className="form-group">
                    <label>Arquivos Existentes</label>
                    <ul>
                        {existingFiles.map((file, index) => (
                            <li key={index}>
                                <span>{file.nome}</span>
                                <button type="button" onClick={() => handleRemoveFile(index)}>
                                    Remover
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="form-group">
                    <label>Adicionar Novos Arquivos</label>
                    <FileUploader onFilesSelected={setFiles} />
                </div>
                {/* Botões */}
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
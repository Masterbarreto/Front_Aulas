import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Hub } from "../ui/hub";
import "../../Styles/EditarAulas.css";
import { LinkModal } from "../ui/LinkModal";
import { FileUploader } from "../ui/FileUploader";

// Base da URL pega do .env
const API_BASE = import.meta.env.VITE_API_URL as string; 
const API_URL = `${API_BASE}/aulas`;                     

export default function EditarAula() {
  const { id: aulaId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [aula, setAula] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [links, setLinks] = useState<any[]>([]);
  const [structuredLinks, setStructuredLinks] = useState<any[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<any[]>([]);
  const linkModalRef = useRef<any>(null);

  // Buscar dados da aula
  useEffect(() => {
    if (!aulaId) return;
    axios
      .get(`${API_URL}/aula-id/${aulaId}`)
      .then((res) => {
        const aulaData = res.data;
        setAula(aulaData);

        // Mapeia os links existentes para o estado structuredLinks
        setStructuredLinks(aulaData.LinkAula || []);
        setLinks(aulaData.LinkAula?.map((link: any) => ({ url: link.url, name: link.name })) || []);

        const mappedFiles = (aulaData.arquivos || []).map((file: any) => ({
          _id: file._id || file.id?.["$oid"], // Corrige para pegar o ID corretamente
          nome: file.nome,
          mimetype: file.mimetype,
        }));
        setExistingFiles(mappedFiles);
      })
      .catch((err) => {
        console.error("Erro ao buscar aula:", err);
        setError("Erro ao carregar aula.");
      })
      .finally(() => setLoading(false));
  }, [aulaId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAula((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleStructuredLinksChange = (newLinks: any[]) => {
    // Combina os links existentes com os novos
    const combinedLinks = [...structuredLinks, ...newLinks];
    setStructuredLinks(combinedLinks);
    setLinks(combinedLinks.map((link) => ({ url: link.url, name: link.name })));
  };

  // Submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aula) return;

    const formData = new FormData();
    formData.append("titulo", aula.titulo || "");
    formData.append("curso", aula.curso || "");
    formData.append("Turma", aula.Turma || "");
    formData.append("Materia", aula.Materia || "");
    formData.append("DayAula", aula.DayAula || "");
    formData.append("Horario", aula.Horario || "");
    formData.append("DesAula", aula.DesAula || "");
    formData.append("LinkAula", JSON.stringify(links)); // Envia os links atualizados

    // IDs dos arquivos existentes (string array)
    const existingIds = existingFiles.map((file) => file._id);
    formData.append("arquivosExistentes", JSON.stringify(existingIds));

    // Novos arquivos enviados
    files.forEach((file) => formData.append("arquivos", file));

    try {
      const res = await axios.patch(`${API_URL}/${aulaId}`, formData);
      setAula(res.data.aula);

      // Atualiza arquivos existentes a partir da resposta
      const mappedFiles = (res.data.aula.arquivos || []).map((file: any) => ({
        _id: file.id?.["$oid"] || "",
        nome: file.nome,
        mimetype: file.mimetype,
      }));
      setExistingFiles(mappedFiles);

      alert("Aula editada com sucesso!");

      // Recarrega a página
      window.location.reload();
    } catch (err: any) {
      console.error("Erro ao enviar dados:", err.response?.data || err);
      alert("Erro ao editar a aula: " + (err.response?.data?.message || "Verifique o console."));
    }
  };

  // Deletar um arquivo existente
  const handleDeleteFile = async (fileId: string) => {
    if (!fileId || !/^[a-f0-9]{24}$/.test(fileId)) {
      console.error("ID inválido:", fileId);
      alert("ID inválido para exclusão.");
      return;
    }

    try {
      await axios.delete(`${API_URL}/arquivos/${fileId}`); // Adiciona o ID do arquivo ao endpoint
      setExistingFiles((prev) => prev.filter((file) => file._id !== fileId));
      alert("Arquivo removido com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir arquivo:", err);
      alert("Erro ao excluir arquivo. Veja o console para mais detalhes.");
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
          <LinkModal
            ref={linkModalRef}
            onLinksChange={handleStructuredLinksChange}
            initialLinks={structuredLinks}
          />
        </div>

        {/* Links Existentes */}
        <div className="form-group">
          <label>Links Existentes</label>
          <ul>
            {structuredLinks.map((link, idx) => (
              <li key={idx} className="link-item">
                <span>{link.name} - {link.url}</span>
                <button
                  type="button"
                  onClick={() => {
                    const updatedLinks = structuredLinks.filter((_, index) => index !== idx);
                    setStructuredLinks(updatedLinks);
                    setLinks(updatedLinks.map((link) => ({ url: link.url, name: link.name })));
                  }}
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Arquivos existentes */}
        <div className="form-group">
          <label>Arquivos Existentes</label>
          <ul>
            {existingFiles.map((file, idx) => (
              <li key={file._id || idx}>
                <span>{file.nome}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (file._id) {
                      handleDeleteFile(file._id);
                    } else {
                      console.error("ID do arquivo está indefinido:", file);
                      alert("Erro: ID do arquivo não encontrado.");
                    }
                  }}
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Upload de novos arquivos */}
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

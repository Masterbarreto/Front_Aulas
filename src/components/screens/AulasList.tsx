// src/components/screens/AulasList.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Hub } from '../ui/hub';
import { ArrowLeft } from 'lucide-react';
import { FileText, Download } from 'lucide-react';
import '../../Styles/AulaTela.css';

interface Aula {
  _id: string;
  titulo: string;
  Horario: string;
  DesAula: string;
  anoEscolar?: string;
  curso?: string;
  Turma?: string;
  Materia?: string;
  arquivos: { nome: string }[];
  arquivosIds?: string[];
}

// Função para normalizar strings
function normalize(str?: string) {
  return (str || "")
    .toLowerCase()
    .replace(/\s/g, "")
    .replace(/-/g, "");
}

interface RouteParams {
  ano: string;
  curso: string;
  turma: string;
  materia: string;
}

const API = 'https://apisubaulas.onrender.com';

export function AulasList() {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const navigate = useNavigate();
  const { ano, curso, turma, materia } = useParams<RouteParams>();

  useEffect(() => {
    axios
      .get('https://apisubaulas.onrender.com/api/v1/aulas/MostarAulas')
      .then(response => setAulas(response.data))
      .catch(error => console.error('Erro ao buscar aulas:', error));
  }, []);

  if (!ano || !curso || !turma || !materia) {
    return <p style={{ color: "#fff" }}>Parâmetros da URL ausentes.</p>;
  }

  // Filtra as aulas conforme os parâmetros da URL, normalizando tudo
  const aulasFiltradas = aulas.filter((aula) =>
    (normalize(ano) === "all"     || normalize(aula.anoEscolar) === "all"     || normalize(aula.anoEscolar) === normalize(ano)) &&
    (normalize(curso) === "all"   || normalize(aula.curso)      === "all"     || normalize(aula.curso)      === normalize(curso)) &&
    (normalize(turma) === "all"   || normalize(aula.Turma)      === "all"     || normalize(aula.Turma)      === normalize(turma)) &&
    (normalize(materia) === "all" || normalize(aula.Materia)    === "all"     || normalize(aula.Materia)    === normalize(materia))
  );

  const handleClick = (aula: Aula) => {
    const id = aula.aulaId || aula._id; // pega o id certo
    navigate(`/${ano}/${curso}/${turma}/${materia}/aulas/${id}`);
  };

  return (
    <>
      <Hub />
      <div className="main-content">
        <div className="aulasList">
          <div
            className="aulasTitulos1"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={32} color="#fff" />
            <span className="aulasH1">Aulas – Senac</span>
          </div>
          <div className="aulasContainer">
            {aulasFiltradas.length === 0 ? (
              <p style={{ color: "#fff" }}>Nenhuma aula encontrada para este filtro.</p>
            ) : (
              aulasFiltradas.map((aula) => (
                <div key={aula._id || aula.aulaId} className="aulaCard" onClick={() => handleClick(aula)}>
                  <h3 className="aulaCardH3">{aula.titulo || "Tema da Aula"}</h3>
                  <p className="aulaCardP">{aula.Horario || "13:15 – 14:30"}</p>
                  <small className="aulaCardSmall">Breve descrição: {aula.DesAula || ""}</small>
                  <div className="aulaCardActions">•••</div>
                  {aula.arquivos && aula.arquivos.length > 0 && (
                    <div className="aulaLinks">
                      {aula.arquivos.map((arq, idx) => {
                        const arquivoId = aula.arquivosIds && aula.arquivosIds[idx];
                        return (
                          <div className="aula-link-card" key={idx}>
                            <div className="aula-link-info">
                              <FileText size={20} style={{ marginRight: 8 }} />
                              {arq.nome}
                            </div>
                            {arquivoId ? (
                              <a
                                href={`${API}/api/v1/aulas/${arquivoId}/pdf`}
                                download={arq.nome}
                                target="_self"
                                className="aula-link-download"
                                title="Baixar PDF"
                              >
                                <Download size={20} />
                              </a>
                            ) : (
                              <span style={{ color: "#aaa", fontSize: 14 }}>Arquivo indisponível</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

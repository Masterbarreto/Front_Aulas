import React, { useEffect, useState } from 'react';
import { Hub } from '../ui/hub';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Link2 } from 'lucide-react';
import '../../Styles/AulaScreens.css';
import axios from 'axios';

interface Arquivo {
  nome: string;
  mimetype: string;
}

interface Aula {
  _id: string;
  anoEscolar: string;
  curso: string;
  titulo: string;
  Turma: string;
  Materia: string;
  DayAula: string;
  Horario: string;
  DesAula: string;
  LinkAula: string;
  concluida: boolean;
  arquivos: Arquivo[];
  arquivosIds: string[];
}

const AulaScreens: React.FC = () => {
  const [aula, setAula] = useState<Aula | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams(); // <-- pega o id da URL

 

  useEffect(() => {
    if (!id) return;
    fetch(`https://apisubaulas.onrender.com/api/v1/aulas/aula-id/${id}`)
        .then(res => res.json())
        .then(data => {
            // Verifica se LinkAula é uma string e converte para um array de objetos
            if (typeof data.LinkAula === "string") {
                try {
                    data.LinkAula = JSON.parse(data.LinkAula);
                } catch (error) {
                    console.error("Erro ao parsear LinkAula:", error);
                    data.LinkAula = [];
                }
            }
            setAula(data);
            setLoading(false);
        });
  }, [id]);

  if (loading) return <div style={{ color: '#fff' }}>Carregando...</div>;
  if (!aula || !aula.Materia) return <div style={{ color: '#fff' }}>Aula não encontrada.</div>;

   console.log("Valor de createdAt:", aula.createdAt)
  return (
    <div className="aula-main-bg">
      <Hub />
      <div className="aulasTitulos">
        <h1 className="aulasH1">
          <ArrowLeft
            size={32}
            color="#fff"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(-1)} // Voltar para a página anterior
          />
          Aula de {aula.titulo.charAt(0).toUpperCase() + aula.titulo.slice(1).toLowerCase()}
        </h1>
        <span className="aulasSubtitulo">materia: {aula.Materia}</span>
      </div>
      <div className="aula-content-container">
        <div className="aula-content">
          {/* Esquerda */}
          <div className="aula-section">
            <div className="aula-section-title">
              <span className="aula-section-icon">
                <FileText size={32} color="#fff" />
              </span>
              Tema da aula
            </div>
            <hr className="aula-section-divider" />
            <div className="aula-section-desc-title">Descrição da Aula :</div>
            <div className="aula-section-desc">
              {aula.DesAula}
            </div>
          </div>
          {/* Direita */}
          <div className="aula-details">
            <div className="aula-details-title">Detalhes da Aula</div>
            <div className="aula-details-item">
              <span className="aula-details-label">Criador da atividade:</span>
              <span className="aula-details-value">
                {aula.professor
                  ? aula.professor.split(" ").slice(0, 2).join(" ") // Exibe apenas o primeiro e o segundo nomes
                  : "Não informado"}
              </span>
            </div>
            <div className="aula-details-item">
              <span className="aula-details-label">Data de Criação:</span>
              <span className="aula-details-value">
                {aula.createdAt
                  ? (() => {
                      const createdAtDate = new Date(aula.createdAt);
                      createdAtDate.setUTCDate(createdAtDate.getUTCDate() - 1); // Subtrai 1 dia em UTC
                      return createdAtDate.toLocaleDateString('pt-BR'); // Formata como DD/MM/AAAA
                    })()
                  : "Não informado"}
              </span>
            </div>
            <div className="aula-details-item">
              <span className="aula-details-label">Dia da Aula :</span>
              <span className="aula-details-value">
                {(() => {
                  const hoje = new Date();
                  const dataAula = new Date(aula.DayAula);
                  hoje.setHours(0, 0, 0, 0);
                  dataAula.setHours(0, 0, 0, 0);
                  const diffTime = dataAula.getTime() - hoje.getTime();
                  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                  if (diffDays === 0) return "Hoje";
                  if (diffDays === 1) return "Amanhã";
                  if (diffDays > 1) return `${diffDays} dias para a aula`;
                  return dataAula.toLocaleDateString("pt-BR");
                })()}
              </span>
            </div>
            <div className="aula-details-item">
              <span className="aula-details-label">Dia que a aula foi criada :</span>
              <span className="aula-details-value">
                {aula.createdAt
                  ? new Date(aula.createdAt).toLocaleDateString('pt-BR') // Formata como DD/MM/AAAA
                  : "Não informado"}
              </span>
            </div>
            <div className="aula-details-links-title">Links e Arquivos</div>
            <div className="aula-details-links">
              {Array.isArray(aula.arquivos) && aula.arquivos.length > 0 ? (
                aula.arquivos.map((arq, idx) => (
                  <button
                    key={`arquivo-${idx}`}
                    className="aula-details-link"
                    style={{ width: "100%", textAlign: "left", background: "none", border: "none", padding: 0, cursor: "pointer" }}
                    onClick={() => {
                      const arquivoId = aula.arquivosIds[idx];
                      if (arquivoId) {
                        fetch(`https://apisubaulas.onrender.com/api/v1/aulas/${arquivoId}/pdf`)
                          .then(res => res.blob())
                          .then(blob => {
                            const urlBlob = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = urlBlob;
                            a.download = arq.nome;
                            a.click();
                            window.URL.revokeObjectURL(urlBlob);
                          });
                      }
                    }}
                  >
                    <span className="aula-details-link-label">
                      <FileText size={20} style={{ marginRight: 8 }} />
                      {arq.nome}
                    </span>
                    <span>
                      <svg width="20" height="20" fill="#fff"><path d="M5 13l4 4 4-4M12 17V7m-4 10V7"/></svg>
                    </span>
                  </button>
                ))
              ) : (
                <span style={{ color: "#aaa", fontSize: 14 }}>Nenhum arquivo disponível</span>
              )}

              {/* Adicionando os links */}
              <div className="aula-details-links">
                {Array.isArray(aula.LinkAula) && aula.LinkAula.length > 0 ? (
                    aula.LinkAula.map((link, idx) => (
                        <div
                            key={`link-${idx}`}
                            className="link-container"
                            onClick={() => window.open(link.url, "_blank")} // Abre o link em uma nova aba
                            style={{
                                cursor: "pointer", // Indica que o contêiner é clicável
                                padding: "10px",
                                background: "#2D2E36",
                                borderRadius: "8px",
                                marginBottom: "12px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                            }}
                        >
                            <div className="link-header">
                                <span className="link-name" style={{ fontWeight: "bold", color: "#fff" }}>
                                    {link.name}
                                </span>
                            </div>
                            <div className="link-body">
                                <span className="link-url" style={{ color: "#888" }}>
                                    {link.url}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <span style={{ color: "#aaa", fontSize: 14 }}>Nenhum link disponível</span>
                )}
              </div>
            </div>
            <button 
              className="aula-details-btn"
              type="button"
              onClick={async () => {
                if (!aula?._id) return;
                try {
                  if (aula.concluida) {
                    // Rota para "Desconcluir Aula"
                    await fetch(`https://apisubaulas.onrender.com/api/v1/aulas/${aula._id}/desconcluir`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                    });
                    alert("Aula marcada como não concluída!");

                    // Registro de atividade ao desconcluir
                    await axios.post(`${import.meta.env.VITE_API_URL}/users/activity`, {
                      userId: "683e372098df1ac06fe24ec3" ,
                      action: "Aula Desconcluída",
                      detalhes: {
                        titulo: aula.titulo,
                        turma: aula.Turma,
                        curso: aula.curso,
                      },
                      data: new Date().toISOString(),
                    });
                  } else {
                    // Rota para "Concluir Aula"
                    await fetch(`https://apisubaulas.onrender.com/api/v1/aulas/${aula._id}/concluir`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ concluida: true }),
                    });
                    alert("Aula concluída com sucesso!");

                    // Registro de atividade ao concluir
                    //const userId = localStorage.getItem("userId");
                    await axios.post(`${import.meta.env.VITE_API_URL}/users/activity`, {
                      userId: "683e372098df1ac06fe24ec3" ,
                      action: "Aula Concluída",
                      detalhes: {
                        titulo: aula.titulo,
                        turma: aula.Turma,
                        curso: aula.curso,
                      },
                      data: new Date().toISOString(),
                    });
                  }

                  // Atualiza o estado da aula
                  setAula({ ...aula, concluida: !aula.concluida });

                  // Volta para a tela anterior após concluir/desconcluir
                  navigate(-1);
                } catch (err) {
                  console.error("Erro ao atualizar status da aula:", err);
                  alert("Erro ao atualizar status da aula! Verifique o console para mais detalhes.");
                }
              }}
            >
              {aula.concluida ? "Desconcluir Aula" : "Concluir Aula"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AulaScreens;
import React, { useEffect, useState } from 'react';
import { Hub } from '../ui/hub';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Link2 } from 'lucide-react';
import '../../Styles/AulaScreens.css';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL;

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
        setAula(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={{ color: '#fff' }}>Carregando...</div>;
  if (!aula || !aula.Materia) return <div style={{ color: '#fff' }}>Aula não encontrada.</div>;

  return (
    <div className="aula-main-bg">
      <Hub />
      <div
        className="aulasTitulos"
        style={{ cursor: "pointer", marginTop: "32px", marginLeft: "260px" }} // 260px = largura da sidebar
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={32} color="#fff" />
        <h1 className="aula-title">
          Aula de {aula.titulo.charAt(0).toUpperCase() + aula.titulo.slice(1).toLowerCase()}
        </h1>
      </div>
      <span className="aula-subtitle" style={{ marginLeft: "304px" }}>
        materia: {aula.Materia}
      </span>
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
              <span className="aula-details-label">Criador da atividade :</span>
              <span className="aula-details-value">
                {aula.professor
                  ? aula.professor.split(" ").slice(0, 2).join(" ") // Exibe apenas o primeiro e o segundo nomes
                  : "Não informado"}
              </span>
            </div>
            <div className="aula-details-item">
              <span className="aula-details-label">Data de Criação :</span>

              <span className="aula-details-value">
                {aula.DayAula
                  ? new Date(aula.DayAula).toLocaleDateString('pt-BR')
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
                  return dataAula.toLocaleDateString('pt-BR');
                })()}
              </span>
            </div>
            <div className="aula-details-links-title">Links e Arquivos</div>
            <div className="aula-details-links">
              {Array.isArray(aula.arquivos) && aula.arquivos.length > 0 ? (
                aula.arquivos.map((arq, idx) => (
                  <button
                    key={idx}
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
                  } else {
                    // Rota para "Concluir Aula"
                    await fetch(`https://apisubaulas.onrender.com/api/v1/aulas/${aula._id}/concluir`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ concluida: true }),
                    });
                    alert("Aula concluída com sucesso!");

                    const userId = localStorage.getItem("userId");
                    await axios.post(`${import.meta.env.VITE_API_URL}/users/activity`, {
                      userId: userId,
                      action: "Atividade concluída",
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
                  alert("Erro ao atualizar status da aula!");
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
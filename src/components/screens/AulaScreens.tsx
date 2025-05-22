import React, { useEffect, useState } from 'react';
import { Hub } from '../ui/hub';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Link2 } from 'lucide-react';
import '../../Styles/AulaScreens.css';

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
              <span className="aula-details-value"> Professor Vitor</span>
            </div>
            <div className="aula-details-item">
              <span className="aula-details-label">Data de Criação :</span>
              <span className="aula-details-value">
                {aula.createdAt
                  ? new Date(aula.createdAt).toLocaleDateString('pt-BR')
                  : "Não informado"}
              </span>
            </div>
            <div className="aula-details-item">
              <span className="aula-details-label">Dia da Aula :</span>
              <span className="aula-details-value">
                {(() => {
                  const hoje = new Date();
                  const dataAula = new Date(aula.DayAula);
                  // Zera horas para comparar só a data
                  hoje.setHours(0,0,0,0);
                  dataAula.setHours(0,0,0,0);
                  const diffTime = dataAula.getTime() - hoje.getTime();
                  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                  if (diffDays === 0) return "Hoje";
                  if (diffDays === 1) return "Amanhã";
                  if (diffDays > 1) return `${diffDays} dias para a aula`;
                  // Se já passou, mostra só a data
                  return dataAula.toLocaleDateString('pt-BR');
                })()}
              </span>
            </div>
            <div className="aula-details-links-title">Links e Arquivos</div>
            <div className="aula-details-links">
              {aula.arquivos.map((arq, idx) => (
                <a
                  key={idx}
                  className="aula-details-link"
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="aula-details-link-label">
                    <FileText size={20} style={{ marginRight: 8 }} />
                    {arq.nome}
                  </span>
                  <span>
                    <svg width="20" height="20" fill="#fff"><path d="M5 13l4 4 4-4M12 17V7m-4 10V7"/></svg>
                  </span>
                </a>
              ))}
            </div>
            <button className="aula-details-btn">Concluir Aula</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AulaScreens;
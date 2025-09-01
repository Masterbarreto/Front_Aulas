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
  professor?: string;
  createdAt?: string;
}

const AulaScreens: React.FC = () => {
  const [aula, setAula] = useState<Aula | null>(null);
  const [loading, setLoading] = useState(true);
  const [todasAulasMesmoTitulo, setTodasAulasMesmoTitulo] = useState<Aula[]>([]);
  
  // Estados para o modal
  const [showConcluirModal, setShowConcluirModal] = useState(false);
  const [professorName, setProfessorName] = useState("");
  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [turmasDisponiveis, setTurmasDisponiveis] = useState<string[]>([]);
  
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
    
    // Buscar a aula específica primeiro
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
        
        // Depois buscar todas as aulas com o mesmo título, matéria e curso
        buscarAulasDoMesmoTipo(data);
      })
      .catch(error => {
        console.error("Erro ao buscar aula:", error);
        setLoading(false);
      });
  }, [id]);

  // Função para buscar todas as aulas do mesmo tipo (mesmo título, matéria, curso)
  const buscarAulasDoMesmoTipo = async (aulaAtual: Aula) => {
    try {
      const response = await axios.get('https://apisubaulas.onrender.com/api/v1/aulas/MostarAulas');
      
      // Filtrar aulas com mesmo título, matéria e curso
      const aulasIguais = response.data.filter((a: Aula) => 
        a.titulo === aulaAtual.titulo && 
        a.Materia === aulaAtual.Materia && 
        a.curso === aulaAtual.curso
      );
      
      setTodasAulasMesmoTitulo(aulasIguais);
      
      // Extrair turmas que ainda não foram concluídas
      const turmasNaoConcluidas = aulasIguais
        .filter((a: Aula) => !a.concluida)
        .map((a: Aula) => a.Turma)
        .filter((turma, index, array) => array.indexOf(turma) === index) // Remove duplicatas
        .sort(); // Ordena as turmas
      
      setTurmasDisponiveis(turmasNaoConcluidas);
      
      console.log("Aulas do mesmo tipo encontradas:", aulasIguais);
      console.log("Turmas disponíveis para conclusão:", turmasNaoConcluidas);
      
    } catch (error) {
      console.error("Erro ao buscar aulas do mesmo tipo:", error);
    }
  };

  // Função para concluir aula em uma turma específica
  const handleConcluirAula = async () => {
    if (!professorName.trim() || !turmaSelecionada.trim()) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    try {
      // Encontrar a aula específica da turma selecionada
      const aulaParaConcluir = todasAulasMesmoTitulo.find(a => 
        a.Turma === turmaSelecionada && !a.concluida
      );

      if (!aulaParaConcluir) {
        alert("Aula não encontrada para esta turma!");
        return;
      }

      console.log("Concluindo aula:", aulaParaConcluir._id, "Turma:", turmaSelecionada);

      // Concluir a aula específica da turma
      await fetch(`https://apisubaulas.onrender.com/api/v1/aulas/${aulaParaConcluir._id}/concluir`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          concluida: true,
          professorResponsavel: professorName
        }),
      });
      
      alert(`Aula "${aula.titulo}" concluída para a Turma ${turmaSelecionada}!`);

      // Registro de atividade
      await axios.post(`${import.meta.env.VITE_API_URL}/users/activity`, {
        userId: "683e372098df1ac06fe24ec3",
        action: "Aula Concluída",
        detalhes: {
          titulo: aula.titulo,
          turma: `Turma ${turmaSelecionada}`,
          professor: professorName,
          curso: aula.curso,
          materia: aula.Materia,
        },
        data: new Date().toISOString(),
      });

      // Atualizar a lista de aulas do mesmo tipo
      const aulasAtualizadas = todasAulasMesmoTitulo.map(a => 
        a._id === aulaParaConcluir._id ? { ...a, concluida: true, professor: professorName } : a
      );
      setTodasAulasMesmoTitulo(aulasAtualizadas);

      // Atualizar turmas disponíveis (remover a turma que foi concluída)
      const novasTurmasDisponiveis = turmasDisponiveis.filter(t => t !== turmaSelecionada);
      setTurmasDisponiveis(novasTurmasDisponiveis);
      
      // Limpar campos do formulário
      setProfessorName("");
      setTurmaSelecionada("");
      
      // Verificar se ainda há turmas para concluir
      if (novasTurmasDisponiveis.length === 0) {
        setShowConcluirModal(false);
        alert("Todas as turmas desta aula foram concluídas!");
        navigate(-1);
      } else {
        alert(`Turma ${turmaSelecionada} concluída! Ainda restam ${novasTurmasDisponiveis.length} turma(s) para concluir.`);
      }

    } catch (err) {
      console.error("Erro ao concluir aula:", err);
      alert("Erro ao concluir aula! Verifique o console para mais detalhes.");
    }
  };

  // Função para desconcluir aula
  const handleDesconcluirAula = async () => {
    try {
      await fetch(`https://apisubaulas.onrender.com/api/v1/aulas/${aula._id}/desconcluir`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      
      alert("Aula marcada como não concluída!");

      await axios.post(`${import.meta.env.VITE_API_URL}/users/activity`, {
        userId: "683e372098df1ac06fe24ec3",
        action: "Aula Desconcluída",
        detalhes: {
          titulo: aula.titulo,
          turma: aula.Turma,
          curso: aula.curso,
        },
        data: new Date().toISOString(),
      });

      setAula({ ...aula, concluida: false });
      
      // Recarregar as aulas do mesmo tipo para atualizar a lista
      if (aula) {
        buscarAulasDoMesmoTipo(aula);
      }
      
      navigate(-1);
    } catch (err) {
      console.error("Erro ao desconcluir aula:", err);
      alert("Erro ao desconcluir aula!");
    }
  };

  if (loading) return <div style={{ color: '#fff' }}>Carregando...</div>;
  if (!aula || !aula.Materia) return <div style={{ color: '#fff' }}>Aula não encontrada.</div>;

  return (
    <div className="aula-main-bg">
      <Hub />
      <div className="aulasTitulos">
        <h1 className="aulasH1">
          <ArrowLeft
            size={32}
            color="#fff"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(-1)}
          />
          Aula de {aula.titulo.charAt(0).toUpperCase() + aula.titulo.slice(1).toLowerCase()}
        </h1>
        <span className="aulasSubtitulo">Matéria: {aula.Materia}</span>
      </div>
      
      <div className="aula-content-container">
        <div className="aula-content">
          <div className="aula-section">
            <div className="aula-section-title">
              <span className="aula-section-icon">
                <FileText size={32} color="#fff" />
              </span>
              Tema da aula
            </div>
            <hr className="aula-section-divider" />
            <div className="aula-section-desc-title">Descrição da Aula:</div>
            <div className="aula-section-desc">
              {aula.DesAula}
            </div>
          </div>
          
          <div className="aula-details">
            <div className="aula-details-title">Detalhes da Aula</div>
            
            <div className="aula-details-item">
              <span className="aula-details-label">Curso:</span>
              <span className="aula-details-value">{aula.curso.toUpperCase()}</span>
            </div>
            
            <div className="aula-details-item">
              <span className="aula-details-label">Turmas com esta aula:</span>
              <span className="aula-details-value">
                {todasAulasMesmoTitulo.length > 0 
                  ? todasAulasMesmoTitulo.map(a => `Turma ${a.Turma}`).join(', ')
                  : `Turma ${aula.Turma}`
                }
              </span>
            </div>
            
            <div className="aula-details-item">
              <span className="aula-details-label">Dia da Aula:</span>
              <span className="aula-details-value">{aula.DayAula}</span>
            </div>
            
            <div className="aula-details-item">
              <span className="aula-details-label">Horário:</span>
              <span className="aula-details-value">{aula.Horario}</span>
            </div>

            {/* Links e Arquivos */}
            <div className="aula-details-links-title">Links e Arquivos</div>
            <div className="aula-details-links">
              {Array.isArray(aula.arquivos) && aula.arquivos.length > 0 ? (
                aula.arquivos.map((arq, idx) => (
                  <div key={idx} className="aula-link-item">
                    <FileText size={16} />
                    <span>{arq.nome}</span>
                  </div>
                ))
              ) : (
                <span style={{ color: "#aaa", fontSize: 14 }}>Nenhum arquivo disponível</span>
              )}
              
              {Array.isArray(aula.LinkAula) && aula.LinkAula.length > 0 ? (
                aula.LinkAula.map((link, idx) => (
                  <div key={idx} className="aula-link-item">
                    <Link2 size={16} />
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.name || link.url}
                    </a>
                  </div>
                ))
              ) : null}
            </div>
            
            {/* Botão de Concluir/Desconcluir */}
            <button 
              className="aula-details-btn"
              type="button"
              onClick={() => {
                if (aula.concluida) {
                  handleDesconcluirAula();
                } else {
                  setShowConcluirModal(true);
                }
              }}
            >
              {aula.concluida ? "Desconcluir Aula" : "Concluir Aula"}
            </button>

            {/* Modal de Concluir Aula */}
            {showConcluirModal && (
              <div className="modal-overlay" onClick={() => setShowConcluirModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2>Concluir Aula</h2>
                    <button 
                      className="modal-close-btn"
                      onClick={() => setShowConcluirModal(false)}
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="modal-body">
                    <p>Preencha essas informações para Concluir a Aula</p>
                    
                    <div className="form-group">
                      <label>Nome de Quem Deu a Aula</label>
                      <input
                        type="text"
                        placeholder="Professor Exemplo"
                        value={professorName}
                        onChange={(e) => setProfessorName(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Turma Que a Aula foi dada</label>
                      <select
                        value={turmaSelecionada}
                        onChange={(e) => setTurmaSelecionada(e.target.value)}
                        className="form-select"
                      >
                        <option value="">Selecione a turma</option>
                        {turmasDisponiveis.map(turma => (
                          <option key={turma} value={turma}>
                            Turma {turma}
                          </option>
                        ))}
                      </select>
                      {turmasDisponiveis.length === 0 && (
                        <p style={{ color: "#ffa500", fontSize: "12px", marginTop: "5px" }}>
                          Todas as turmas já foram concluídas para esta aula.
                        </p>
                      )}
                      {turmasDisponiveis.length > 0 && (
                        <p style={{ color: "#888", fontSize: "12px", marginTop: "5px" }}>
                          {turmasDisponiveis.length} turma(s) disponível(eis) para conclusão
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="modal-footer">
                    <button 
                      className="btn-secondary"
                      onClick={() => setShowConcluirModal(false)}
                    >
                      Fechar
                    </button>
                    <button 
                      className="btn-primary"
                      onClick={handleConcluirAula}
                      disabled={turmasDisponiveis.length === 0}
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AulaScreens;
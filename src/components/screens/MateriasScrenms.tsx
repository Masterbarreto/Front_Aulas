import "../../Styles/MateriaSceens.css";
import { Hub } from "../ui/hub";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import {
  BookText,
  MessageCircle,
  Plus,
  Globe,
  BookOpen,
  Atom,
  Cpu,
  Drama,
  Dumbbell,
  GraduationCap,
  User,
  FlaskConical,
  Fish,
  ArrowLeft,
} from "lucide-react";

const materias = [
  { nome: "Portugues", icon: BookText, id: "portugues" },
  { nome: "inglês", icon: MessageCircle, id: "ingles" },
  { nome: "Matemática", icon: Plus, id: "matematica" },
  { nome: "Geografia", icon: Globe, id: "geografia" },
  { nome: "Filosofia", icon: BookOpen, id: "filosofia" },
  { nome: "Física", icon: Atom, id: "fisica" },
  { nome: "FTP", icon: Cpu, id: "ftp" },
  { nome: "Artes", icon: Drama, id: "artes" },
  { nome: "Educação Física", icon: Dumbbell, id: "educacao-fisica" },
  { nome: "História", icon: GraduationCap, id: "historia" },
  { nome: "Sociologia", icon: User, id: "sociologia" },
  { nome: "Quimica", icon: FlaskConical, id: "quimica" },
  { nome: "Biologia", icon: Fish, id: "biologia" },
];

const turmas = ["1", "2", "3", "4"];

export default function MateriasScrenms() {
  const navigate = useNavigate();
  const { ano, curso } = useParams();
  const [turmaSelecionada, setTurmaSelecionada] = React.useState(turmas[0]);

  const handleMateriaClick = (materiaId: string) => {
    navigate(`/${ano}/${curso}/${turmaSelecionada}/${materiaId}/aulas`);
  };

  return (
    <div className="container-primeiro-ano">
      <Hub />
      <div className="materias-max-container">
        <div className="main-ano-content">
          <div
            className="conteiner-Titulos"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={32} color="#fff" />
            <h1>
              Turmas do {ano?.replace("-", " ").toUpperCase()} – Senac
            </h1>
          </div>
          <div className="subtitulo-cursos">
            Turmas do curso ({curso?.toUpperCase()}):
          </div>
          <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
            {turmas.map((turma) => (
              <button
                key={turma}
                style={{
                  background: turmaSelecionada === turma ? "#23262f" : "#181b22",
                  color: "#fff",
                  border: "none",
                  borderBottom: turmaSelecionada === turma ? "2px solid #573bff" : "2px solid transparent",
                  padding: "12px 32px",
                  borderRadius: "8px 8px 0 0",
                  cursor: "pointer",
                  fontWeight: turmaSelecionada === turma ? "bold" : "normal",
                }}
                onClick={() => setTurmaSelecionada(turma)}
              >
                {turma.replace("-", " ")}
              </button>
            ))}
          </div>
          <div className="materias-grid">
            {materias.map((materia) => {
              const Icon = materia.icon;
              return (
                <div
                  key={materia.id}
                  className="materia-card"
                  onClick={() => handleMateriaClick(materia.id)}
                >
                  <Icon size={40} style={{ marginBottom: 12 }} />
                  <span>{materia.nome}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
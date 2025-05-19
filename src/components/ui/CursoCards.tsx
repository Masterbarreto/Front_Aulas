import React from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/CursoCards.css";

interface CursoCardProps {
  image: string;
  title: string;
  to?: string; // rota de destino opcional
}

export function CursoCards({ cursos }: { cursos: CursoCardProps[] }) {
  const navigate = useNavigate();

  return (
    <div className="cursos-grid">
      {cursos.map((curso, idx) => (
        <div
          className="curso-card"
          key={idx}
          style={{ cursor: "pointer" }}
          onClick={() => {
            if (curso.to) {
              navigate(curso.to);
            }
          }}
        >
          <img src={curso.image} alt={curso.title} className="curso-img" />
          <div className="curso-title">{curso.title}</div>
        </div>
      ))}
    </div>
  );
}
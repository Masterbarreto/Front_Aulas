import React from "react";
import { useNavigate } from "react-router-dom";

interface Aula {
  _id?: string;
  aulaId?: string;
  titulo: string;
}

interface ResumoColunaProps {
  titulo: string;
  aulas: Aula[];
}

export function ResumoColuna({ titulo, aulas }: ResumoColunaProps) {
  const navigate = useNavigate();

  return (
    <div className="resumo-coluna">
      <h2>{titulo}</h2>
      {aulas.length === 0 && (
        <div className="resumo-item">Nenhuma aula encontrada.</div>
      )}
      {aulas.map((item, index) => (
        <div
          key={item._id || item.aulaId || index}
          className="resumo-item"
          style={{ cursor: "pointer" }}
          onClick={() => {
            const id = item._id || item.aulaId;
            if (id) navigate(`/aulas/${id}`);
          }}
        >
          {item.titulo}
        </div>
      ))}
    </div>
  );
}
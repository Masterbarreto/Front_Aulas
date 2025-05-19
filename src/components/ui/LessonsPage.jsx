import React from "react";
import { Hub } from "../ui/hub";
import Breadcrumbs from "../ui/Breadcrumbs";

export default function LessonsPage({ title, lessons, loading, emptyMessage }) {
  if (loading) return <div>Carregando...</div>;
  if (!lessons?.length) return <div>{emptyMessage || "Nenhuma aula encontrada."}</div>;

  return (
    <div className="home-container">
      <Hub />
      <div className="container-título">
        <Breadcrumbs />
        <h1>{title}</h1>
        <div className="courses-container">
          {lessons.map(aula => (
            <div key={aula.id} className="course-card">
              <span>{aula.name}</span>
              {aula.date && <small>{aula.date}</small>}
              {aula.description && <p>{aula.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
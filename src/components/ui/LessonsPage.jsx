import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Hub } from "../ui/hub";
import Breadcrumbs from "../ui/Breadcrumbs";
import LessonsPage from "../ui/LessonsPage";
import { Download } from "react-feather";

export default function AulasList() {
  const { ano, curso, turma, materia } = useParams();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://apisubaulas.onrender.com/api/v1/aulas/MostarAulas")
      .then((res) => res.json())
      .then((data) => {
        setLessons(data);
        setLoading(false);
      });
  }, []);

  // Filtra as aulas conforme os parâmetros da URL
  const aulasFiltradas = lessons.filter(
    (aula) =>
      aula.ano === ano &&
      aula.curso === curso &&
      aula.turma === turma &&
      aula.materia === materia
  );

  return (
    <div className="home-container">
      <Hub />
      <div className="container-título">
        <Breadcrumbs />
        <LessonsPage
          title={`Aulas de ${materia?.toUpperCase()} - Turma ${turma}`}
          lessons={aulasFiltradas}
          loading={loading}
          emptyMessage="Nenhuma aula encontrada para este filtro."
        />
        {aulasFiltradas.map((aula) =>
          aula.arquivos.map((arq) => (
            <a
              href={`https://apisubaulas.onrender.com/api/v1/aulas/${arq._id}/pdf`}
              download={arq.nome}
              className="aula-link-download"
              title="Baixar PDF"
              key={arq._id}
            >
              <Download size={20} />
            </a>
          ))
        }
      </div>
    </div>
  );
}

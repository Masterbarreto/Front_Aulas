import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';
import { Hub } from "../ui/hub";
import { CursoCards } from "../ui/CursoCards";

import imageIot from "../../assets/imageIot.png";
import imageMmd from "../../assets/imageMmd.png";
import imageMkt from "../../assets/imageMkt.png";
import imageAdm from "../../assets/imageAdm.png";
import imageTi from "../../assets/imageTi.png";
import imageCdd from "../../assets/imageCdd.png";
import imageIA from "../../assets/imageIA.png"

import "../../Styles/AnoSceens.css";

export function YearScreen() {
  const { ano } = useParams();
  const navigate = useNavigate();

  const cursos = [
    { image: imageIot, title: "IOT – Internet das Coisas", id: "iot" },
    { image: imageTi, title: "TI – Informática", id: "ti" },
    { image: imageMmd, title: "MMD – Multimídia", id: "mmd" },
    { image: imageCdd, title: "CDD – Ciências de Dados", id: "cdd" },
    { image: imageAdm, title: "ADM – Administração", id: "adm" },
    { image: imageMkt, title: "MKT – Marketing", id: "mkt" },
    { image: imageIA, title: "IA – Inteligência Artificial", id: "ia" },
  ];

  const handleCursoClick = (cursoId: string) => {
    navigate(`/${ano}/${cursoId}/materias`);
  };

  return (
    <div className="container-primeiro-ano">
      <Hub />
      <div className="main-ano-content">
        <div
          className="conteiner-Titulos-ano"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={44} color="#fff" />
          <div className="container-Turma">
            <h1>Turmas do  {ano}   – Senac</h1>
          </div>
        </div>
        <div className="subtitulo-cursos">
          <span>Cursos Técnicos:</span>
        </div>
        <div className="container-cards">
          {cursos.map((curso) => (
            <div key={curso.id} onClick={() => handleCursoClick(curso.id)}>
              <CursoCards cursos={[curso]} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
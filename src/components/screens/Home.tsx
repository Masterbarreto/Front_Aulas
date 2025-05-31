import { Hub } from "../ui/hub";
import "../../Styles/homePage.css";
import { AnoCard } from "../ui/AnoCard";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const navigate = useNavigate();

  const anos = ["1-ano", "2-ano", "3-ano"];

  return (
    <div className="home-container">
      <Hub />
      <div className="Text-container">
        <h1 className="Title">Bem-vindos Professores</h1>
        <p className="subTitle">Seus Cursos</p>
        <div className="bot-container">
          {anos.map((ano) => (
            <div key={ano} onClick={() => navigate(`/${ano}`)}>
              <AnoCard titulo={`${ano.charAt(0)} º Ano`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

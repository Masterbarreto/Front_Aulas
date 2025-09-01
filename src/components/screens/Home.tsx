import { Hub } from "../ui/hub";
import "../../Styles/homePage.css";
import { AnoCard } from "../ui/AnoCard";
import { useNavigate } from "react-router-dom";
import { MobileMenu } from "../ui/MobileMenu";

export function HomePage() {
  const navigate = useNavigate();
  const anos = ["1-ano", "2-ano", "3-ano"];
  return (
    <div className="home-container">
      <Hub className="hub-home" />
      
      <div className="Text-container">        <div className="title-container">
          <MobileMenu />
          <h1 className="Title">Bem-vindos Professores</h1>
        </div>
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
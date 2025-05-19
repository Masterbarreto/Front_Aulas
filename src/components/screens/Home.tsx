import { Hub } from "../ui/hub";
import Breadcrumbs from "../ui/Breadcrumbs";
import "../../Styles/homePage.css";
import { AnoCard } from "../ui/AnoCard";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const navigate = useNavigate();

  const anos = ["1-ano", "2-ano", "3-ano"];

  return (
    <div className="home-container">
      <Hub />
      <div className="container-título">
        <div className="header-container">
          <h1>Bem-vindo, Professor(a)!</h1>
        </div>
        <div className="container-icone">
          <p className="text-cursos">Seus Cursos</p>
          <div className="anos-container">
            {anos.map((ano) => (
              <div key={ano} onClick={() => navigate(`/${ano}`)}>
                <AnoCard titulo={`${ano.charAt(0)} º Ano`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

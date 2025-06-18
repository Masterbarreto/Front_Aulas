// App.tsx
import { Routes, Route, useLocation } from "react-router-dom";
import { AnalyticsBrowser } from "@segment/analytics-next";
import { useEffect } from "react";

import { LoginPages } from "../src/components/screens/Login";
import { HomePage } from "../src/components/screens/Home";
import { RegisterScreen } from "../src/components/screens/ResiterScreen";
import { RenderPassword } from "../src/components/screens/renderPasword";
import { ValidateAccount } from "../src/components/screens/ValidateAccount";
import { ResetPasswordScreen } from "../src/components/screens/ResetPasswordScreen";
import { UplodScreen } from "../src/components/screens/UplodScreen";
import { YearScreen } from "../src/components/screens/1AnoScreens";
import { AulasList } from "./components/screens/AulasList";
import RelatorioAulas from "./components/screens/RelatoriAulas";
import RelatorioEdit from "./components/screens/RelatorioEdit";
import MateriasScrenms from "./components/screens/MateriasScrenms";
import AulaScreens from "./components/screens/AulaScreens";
import EditarAula from './components/screens/EditarAula';

import "./App.css";

// Inicializa o Segment Analytics
const analytics = AnalyticsBrowser.load({
  writeKey: "2DnuujYPsWB3IARRCuGMATKP6tUWaEcx",
  
});

function App() {
  const location = useLocation();

  // Captura as mudanças de rota e envia os dados ao Segment Analytics
  useEffect(() => {
    analytics.page({
      path: location.pathname,
      title: document.title,
    });
  }, [location]);

  return (
    <Routes>
      {/* Rotas fixas */}
      <Route path="/" element={<HomePage />} /> {/* rota padrão */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPages />} /> {/* Rota de login */}
      <Route path="/editar-aula" element={<RelatorioEdit />} /> {/* Rota de edição de relatório */}
      {/* Rotas dinâmicas */}
      <Route path="/:ano" element={<YearScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/reset-password" element={<RenderPassword />} />
      <Route path="/validate-account" element={<ValidateAccount />} />
      <Route path="/reset-password-confirm" element={<ResetPasswordScreen />} /> {/* Nova rota */}
      <Route path="/upload" element={<UplodScreen />} /> {/* Nova rota */}
      <Route path="/:ano/:curso/materias/aulas" element={<AulasList />} />
      <Route path="/:ano/:curso/materias" element={<MateriasScrenms />} /> {/* Nova rota */}
      <Route path="/:ano/:curso/:turma/:materia/aulas" element={<AulasList />} />
      <Route path="/:ano/:curso/:turma/:materia/aulas/:id" element={<AulaScreens />} />
      <Route path="/relatorio-aulas" element={<RelatorioAulas />} />
      <Route path="/editar-aula/:id" element={<EditarAula />} /> {/* Rota para edição de aula */}
    </Routes>
  );
}

export default App;

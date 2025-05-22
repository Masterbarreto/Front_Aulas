// App.tsx
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import { LoginPages } from "../src/components/screens/Login";
import { HomePage } from "../src/components/screens/Home";
import { RegisterScreen } from "../src/components/screens/ResiterScreen";
import { RenderPassword } from "../src/components/screens/renderPasword";
import { ValidateAccount } from "../src/components/screens/ValidateAccount";
import { ResetPasswordScreen } from "../src/components/screens/ResetPasswordScreen";
import { UplodScreen } from "../src/components/screens/UplodScreen";
import { YearScreen } from "../src/components/screens/1AnoScreens";
import { AulasList } from "./components/screens/AulasList";
import MateriasScrenms from "./components/screens/MateriasScrenms";
import AulaScreens from "./components/screens/AulaScreens";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas fixas */}
        <Route path="/" element={<LoginPages />} />
        <Route path="/home" element={<HomePage />} />
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
        {/* Nova rota */}
      </Routes>
      <main className="content"></main>
    </Router>
  );
}

export default App;

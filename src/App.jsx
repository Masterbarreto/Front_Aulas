// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPages } from "../src/components/screens/Login";
import { HomePage } from "../src/components/screens/Home";
import { RegisterScreen } from "../src/components/screens/ResiterScreen";
import { RenderPassword } from "../src/components/screens/renderPasword";
import { ValidateAccount } from "../src/components/screens/ValidateAccount";
import { ResetPasswordScreen } from "../src/components/screens/ResetPasswordScreen"; // Importa a nova tela

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPages />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/reset-password" element={<RenderPassword />} />
        <Route path="/validate-account" element={<ValidateAccount />} />
        <Route path="/reset-password-confirm" element={<ResetPasswordScreen />} /> {/* Nova rota */}
      </Routes>
      <main className="content"></main>
    </Router>
  );
}

export default App;

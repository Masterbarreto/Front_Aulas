import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../Styles/Login.css";

export function RenderPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/request-password-reset`,
        { email }
      );

      setMessage("E-mail de redefinição enviado com sucesso!");
      setTimeout(() => navigate("/reset-password-confirm", { state: { email } }), 2000); // Redireciona para a tela de redefinição de senha
    } catch (error) {
      setMessage("Erro ao enviar o e-mail. Tente novamente.");
    }
  };

  return (
    <div className="container-principal">
      <div className="container-logo">
        <h1>Solicitar Redefinição de Senha</h1>
      </div>

      <form className="container-form" onSubmit={handleSubmit}>
        <label className="input-label">E-mail</label>
        <input
          type="email"
          placeholder="Digite seu e-mail"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {message && <p className="error-message">{message}</p>}

        <button type="submit" className="btn-login">Enviar</button>
      </form>
    </div>
  );
}
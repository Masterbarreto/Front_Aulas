import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../Styles/EsqueciAsenha.css";

export function ResetPasswordScreen() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("As senhas não coincidem.");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/reset-password`, {
        email,
        code,
        newPassword,
      });

      setMessage("Senha redefinida com sucesso!");
      setTimeout(() => navigate("/"), 2000); // Redireciona para a tela inicial após 2 segundos
    } catch (error) {
      setMessage("Erro ao redefinir a senha. Tente novamente.");
    }
  };

  return (
    <div className="container-principal-EsqueciSenha">
      <div className="container-logo-EsqueciSenha">
        <h1>Redefinir Senha</h1>
      </div>

      <form className="container-form-EsqueciSenha" onSubmit={handleSubmit}>
        <label className="input-label">E-mail</label>
        <input
          type="email"
          placeholder="Digite seu e-mail"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="input-label">Código</label>
        <input
          type="text"
          placeholder="Digite o código recebido"
          className="input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />

        <label className="input-label">Nova Senha</label>
        <input
          type="password"
          placeholder="Digite sua nova senha"
          className="input"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <label className="input-label">Confirmar Nova Senha</label>
        <input
          type="password"
          placeholder="Confirme sua nova senha"
          className="input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {message && <p className="error-message">{message}</p>}

        <button type="submit" className="btn-login">Redefinir Senha</button>
      </form>
    </div>
  );
}
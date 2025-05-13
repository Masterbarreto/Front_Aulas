import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../../assets/img Logo.jpg";
import "../../Styles/Login.css";

interface LoginData {
  email: string;
  password: string;
}

const schema = Yup.object().shape({
  email: Yup.string().required("Email é obrigatório"),
  password: Yup.string().required("Senha é obrigatória"),
});

export function LoginPages() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({ resolver: yupResolver(schema) });

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false); // Estado para controlar o carregamento
  const navigate = useNavigate();

  const onSubmit = async (data: LoginData) => {
    setLoading(true); // Ativa o estado de carregamento
    setServerError(""); // Limpa mensagens de erro anteriores

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, data);
      console.log("Login bem-sucedido:", response.data);

      // Verifica o cargo do usuário e redireciona
      const { cargo } = response.data;
      if (cargo === "admin") {
        navigate("/admin"); // Redireciona para a rota de admin
      } else if (cargo === "Professor") {
        navigate("/home"); // Redireciona para a rota de usuário
      } else {
        console.error("Tipo de usuário desconhecido:", cargo);
        setServerError("Erro: Tipo de usuário desconhecido.");
      }
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      const errorMessage = error?.response?.data?.message || "Erro desconhecido.";

      // Redireciona para a rota de validação se a conta não estiver verificada
      if (errorMessage === "Conta não verificada. Verifique seu e-mail.") {
        navigate("/validate-account", { state: { email: data.email } });
      } else {
        setServerError(errorMessage);
      }
    } finally {
      setLoading(false); // Desativa o estado de carregamento
    }
  };

  return (
    <div className="container-principal">
      <div className="container-logo">
        <img src={Logo} alt="Logo" />
      </div>

      <form className="container-form" onSubmit={handleSubmit(onSubmit)}>
        {errors.email && <p className="error-message">{errors.email.message}</p>}
        <label className="input-label">Email</label>
        <Controller
          control={control}
          name="email"
          defaultValue=""
          render={({ field }) => (
            <input type="email" placeholder="Digite seu email" className="input" {...field} />
          )}
        />

        {errors.password && <p className="error-message">{errors.password.message}</p>}
        <label className="input-label">Senha</label>
        <Controller
          control={control}
          name="password"
          defaultValue=""
          render={({ field }) => (
            <input type="password" placeholder="Digite sua senha" className="input" {...field} />
          )}
        />

        {serverError && <p className="error-message">{serverError}</p>}

        {loading && <p className="loading-message">Carregando...</p>} {/* Indicador de carregamento */}

        <div className="container-forgot-password">
          <a href="/reset-password">Esqueceu a senha?</a>
        </div>

        <button type="submit" className="btn-login" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"} {/* Botão muda de texto durante o carregamento */}
        </button>

        <div className="container-register-text">
          <p className="register-text">
            Não tem uma conta?{" "}
            <button
              type="button"
              className="register-link"
              onClick={() => navigate("/register")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate("/register");
                }
              }}
            >
              Cadastre-se
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

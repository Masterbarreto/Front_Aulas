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
  const navigate = useNavigate();

  const onSubmit = async (data: LoginData) => {
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
      setServerError(error?.response?.data?.message || "Erro desconhecido.");
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
          defaultValue="" // Define um valor padrão vazio
          render={({ field }) => (
            <input type="email" placeholder="Digite seu email" className="input" {...field} />
          )}
        />

        {errors.password && <p className="error-message">{errors.password.message}</p>}
        <label className="input-label">Senha</label>
        <Controller
          control={control}
          name="password"
          defaultValue="" // Define um valor padrão vazio
          render={({ field }) => (
            <input type="password" placeholder="Digite sua senha" className="input" {...field} />
          )}
        />

        {serverError && <p className="error-message">{serverError}</p>}

        <div className="container-forgot-password">
          <a href="/">Esqueceu a senha?</a>
        </div>

        <button type="submit" className="btn-login">Entrar</button>

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

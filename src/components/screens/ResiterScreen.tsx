import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { handleCreateUser } from "../../http/handleCreateUser";

import "../../Styles/Resiter.css";

interface RegisterData {
  email: string;
  password: string;
  name: string;
  cargo: string;
}

const schema = Yup.object().shape({
  email: Yup.string().required("Email é obrigatório"),
  password: Yup.string().required("Senha é obrigatória"),
  name: Yup.string().required("Nome é obrigatório"),
  cargo: Yup.string().oneOf(["Professor"], "Cargo inválido").required("Cargo é obrigatório"),
});

export function RegisterScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({ resolver: yupResolver(schema) });

  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterData) => {
    const result = await handleCreateUser(data);

    if (result.success) {
      console.log("Registro bem-sucedido!");
      navigate("/");
    } else {
      console.error(result.error);
      setServerError(result.error || "Erro desconhecido.");
    }
  };

  return (
    <div className="container-principal">
      <div className="container-logo">
        {/* Adicione o logo aqui, se necessário */}
      </div>

      <form className="container-form" onSubmit={handleSubmit(onSubmit)}>
        {errors.name && <p className="error-message">{errors.name.message}</p>}
        <label className="input-label">Nome</label>
        <Controller
          control={control}
          name="name"
          defaultValue=""
          render={({ field }) => (
            <input type="text" placeholder="Digite seu nome" className="input" {...field} />
          )}
        />

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

        {errors.cargo && <p className="error-message">{errors.cargo.message}</p>}
        <label className="input-label">Cargo</label>
        <Controller
          control={control}
          name="cargo"
          defaultValue="Professor"
          render={({ field }) => (
            <select className="input" {...field}>
              <option value="Professor">Professor</option>
            </select>
          )}
        />

        {serverError && <p className="error-message">{serverError}</p>}

        <button type="submit" className="btn-login">Registrar</button>

        <div className="container-register-text">
          <p className="register-text">
            Já tem uma conta?{" "}
            <button
              type="button"
              className="register-link"
              onClick={() => navigate("/")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate("/login");
                }
              }}
            >
              Faça login
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

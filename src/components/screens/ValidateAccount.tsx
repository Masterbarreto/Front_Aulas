import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../../Styles/Login.css"; // Reutilizando o CSS da tela de login

export function ValidateAccount() {
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/verify`, {
                email,
                code,
            });
            setMessage("Conta verificada com sucesso!");
            setTimeout(() => navigate("/"), 2000);
        } catch (error) {
            setMessage("Erro ao verificar a conta. Tente novamente.");
        }
    };

    return (
        <div className="container-principal">
            <div className="container-logo">
                <h1>Validação de Conta</h1>
            </div>

            <form className="container-form" onSubmit={handleSubmit}>
                <label className="input-label">Código de Validação</label>
                <input
                    type="text"
                    placeholder="Digite o código de validação"
                    className="input"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <button type="submit" className="btn-login">Validar</button>
            </form>

            {message && <p className="error-message">{message}</p>}
        </div>
    );
}
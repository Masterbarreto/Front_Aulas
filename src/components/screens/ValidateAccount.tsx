import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../../Styles/Validation.css"; // Reutilizando o CSS da tela de login

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
        <div className="validation-container-principal">
            <div className="validation-container-logo">
                <h1>Validação de Conta</h1>
            </div>

            <form className="validation-container-form" onSubmit={handleSubmit}>
                <label className="validation-input-label">Código de Validação</label>
                <input
                    type="text"
                    placeholder="Digite o código de validação"
                    className="validation-input"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <button type="submit" className="validation-btn-login">Validar</button>
            </form>

            {message && <p className="validation-error-message">{message}</p>}
        </div>
    );
}
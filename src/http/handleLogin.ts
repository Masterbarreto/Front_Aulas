import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { NavigateFunction } from "react-router-dom"; 


export async function handleLogin(
    data : {email: string, password: string}, 
    navigate: NavigateFunction
){
    try {
        if(!data.email || !data.password) {
            alert("Please fill in all fields.");
        }

        const url = `${import.meta.env.VITE_API_URL}/users/login/`;

        let response = await axios 
        .post(url, { email: data.email, password: data.password })
        .then((res) => res.data)
        .catch((e) => e.response?.data || { error: "Erro desconhecido" });

        if (response.error?.message === "usuario não encontrado.") {
            return { validationError: "Usuário não encontrado." };
        }
        if (response.error?.message === "senha incorreta.") {
            return { passwordValidation: "Senha incorreta." };
        }

        const roles: Record<string, string> = {
            user: "/home",
            admin: "/admin",
        };

        await AsyncStorage.setItem("credentials", JSON.stringify(response));

        // Verifica se response.cargo é válido
        if (!response.cargo || !(response.cargo in roles)) {
            console.error("Erro: Tipo de usuário desconhecido.", response);
            return { error: "Erro ao fazer login. Tipo de usuário desconhecido." };
        }

        navigate(roles[response.cargo]); // Redireciona para a rota correspondente ao tipo de usuário

    } catch (error) {
            console.error("Erro ao fazer login:", error);
            return { error: "Erro ao fazer login." };
    }
}
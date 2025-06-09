import axios from "axios";

interface CreateUserPayload {
  email: string;
  password: string;
  name: string;
  cargo: string;
}

export async function handleCreateUser(data: CreateUserPayload): Promise<{ success?: boolean; error?: string }> {
  try {
    // Verifica se todos os campos estão preenchidos
    if (!data.email || !data.password || !data.name || !data.cargo) {
      return { error: "Por favor, preencha todos os campos." };
    }

    const url = `https://apisubaulas.onrender.com/api/v1/aulas/users/register`;

    // Faz a requisição para a API
    const response = await axios.post(url, data);

    console.log("Usuário criado com sucesso:", response.data);

    return { success: true }; // Retorna sucesso
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error);

    // Retorna a mensagem de erro da API ou uma mensagem genérica
    return { error: error?.response?.data?.message || "Erro desconhecido ao criar usuário." };
  }
}